import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style("whitegrid")
plt.rcParams["figure.figsize"] = (14, 10)

# Read the CSV files
test_results = pd.read_csv("test_results.csv")
system_monitor = pd.read_csv("performance_log.csv")

# Create a figure with multiple subplots
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle("TODO API Performance Analysis", fontsize=16, fontweight="bold")

# Use comprehensive test data for all charts (clean sequence: 10→1000 objects)
comp_data = test_results[test_results["TestName"].str.startswith("Comprehensive_")].sort_values("ObjectCount")

# 1. Average Time vs Object Count (by Operation)
ax1 = axes[0, 0]
for operation in comp_data["Operation"].unique():
    data = comp_data[comp_data["Operation"] == operation]
    ax1.plot(
        data["ObjectCount"],
        data["AvgTime_ms"],
        marker="o",
        label=operation,
        linewidth=2,
    )
ax1.set_xlabel("Number of Objects", fontsize=12)
ax1.set_ylabel("Average Time (ms)", fontsize=12)
ax1.set_title("Average Operation Time vs Object Count", fontsize=14, fontweight="bold")
ax1.legend()
ax1.grid(True, alpha=0.3)

# 2. Total Time vs Object Count (by Operation)
ax2 = axes[0, 1]
for operation in comp_data["Operation"].unique():
    data = comp_data[comp_data["Operation"] == operation]
    ax2.plot(
        data["ObjectCount"],
        data["TotalTime_ms"],
        marker="s",
        label=operation,
        linewidth=2,
    )
ax2.set_xlabel("Number of Objects", fontsize=12)
ax2.set_ylabel("Total Time (ms)", fontsize=12)
ax2.set_title("Total Operation Time vs Object Count", fontsize=14, fontweight="bold")
ax2.legend()
ax2.grid(True, alpha=0.3)

# 3. Memory Usage — use comprehensive test averaged across operations for a clean sequence
comp_mem = test_results[test_results["TestName"].str.startswith("Comprehensive_")]
comp_mem_avg = comp_mem.groupby("ObjectCount")[["UsedMemory_MB", "FreeMemory_MB"]].mean().reset_index()
comp_mem_avg = comp_mem_avg.sort_values("ObjectCount")

ax3 = axes[1, 0]
ax3.plot(
    comp_mem_avg["ObjectCount"],
    comp_mem_avg["UsedMemory_MB"],
    marker="o",
    label="Used Memory",
    linewidth=2,
    color="red",
)
ax3.plot(
    comp_mem_avg["ObjectCount"],
    comp_mem_avg["FreeMemory_MB"],
    marker="s",
    label="Free Memory",
    linewidth=2,
    color="green",
)
ax3.set_xlabel("Number of Objects", fontsize=12)
ax3.set_ylabel("Memory (MB)", fontsize=12)
ax3.set_title("JVM Memory Usage vs Object Count", fontsize=14, fontweight="bold")
ax3.legend()
ax3.grid(True, alpha=0.3)

# 4. CPU Usage vs Number of Objects
# Map monitoring time-series to object count levels using comprehensive test durations
system_monitor["Timestamp"] = pd.to_datetime(system_monitor["Timestamp"])
system_monitor["Seconds"] = (
    system_monitor["Timestamp"] - system_monitor["Timestamp"].min()
).dt.total_seconds()
monitor_duration = system_monitor["Seconds"].max()

# Use comprehensive test: sum CREATE+UPDATE+DELETE time per object count
comp = test_results[test_results["TestName"].str.startswith("Comprehensive_")]
comp_by_size = comp.groupby("ObjectCount")["TotalTime_ms"].sum().reset_index()
comp_by_size = comp_by_size.sort_values("ObjectCount").reset_index(drop=True)
comp_total_ms = comp_by_size["TotalTime_ms"].sum()

# Proportionally assign monitoring seconds to each object count level
comp_by_size["CumFraction"] = comp_by_size["TotalTime_ms"].cumsum() / comp_total_ms
comp_by_size["StartFraction"] = comp_by_size["CumFraction"].shift(1).fillna(0)

# The comprehensive test occupies the tail of the monitoring window
# Individual tests total ~8.3s; estimate comprehensive starts at ~55% of monitor window
comp_start_frac = 0.55
comp_end_frac = 1.0
comp_window = comp_end_frac - comp_start_frac

cpu_per_objects = []
for _, row in comp_by_size.iterrows():
    start_sec = (comp_start_frac + row["StartFraction"] * comp_window) * monitor_duration
    end_sec = (comp_start_frac + row["CumFraction"] * comp_window) * monitor_duration
    mask = (system_monitor["Seconds"] >= start_sec) & (system_monitor["Seconds"] < end_sec)
    cpu_vals = system_monitor.loc[mask, "CPU%"]
    cpu_per_objects.append(cpu_vals.mean() if len(cpu_vals) > 0 else system_monitor["CPU%"].mean())

ax4 = axes[1, 1]
ax4.plot(comp_by_size["ObjectCount"], cpu_per_objects, marker="o", linewidth=2, color="purple")
ax4.set_xlabel("Number of Objects", fontsize=12)
ax4.set_ylabel("CPU Usage (%)", fontsize=12)
ax4.set_title("System CPU Usage vs Number of Objects", fontsize=14, fontweight="bold")
ax4.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("performance_analysis.png", dpi=300, bbox_inches="tight")
print("Chart saved as 'performance_analysis.png'")

# Create additional detailed charts
fig2, axes2 = plt.subplots(1, 3, figsize=(18, 5))
fig2.suptitle("Operation Comparison", fontsize=16, fontweight="bold")

operations = test_results["Operation"].unique()
colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"]

for idx, operation in enumerate(operations):
    data = test_results[test_results["Operation"] == operation]
    axes2[idx].bar(
        data["ObjectCount"].astype(str),
        data["AvgTime_ms"],
        color=colors[idx],
        alpha=0.7,
    )
    axes2[idx].set_xlabel("Object Count", fontsize=11)
    axes2[idx].set_ylabel("Avg Time (ms)", fontsize=11)
    axes2[idx].set_title(f"{operation} Performance", fontsize=13, fontweight="bold")
    axes2[idx].tick_params(axis="x", rotation=45)
    axes2[idx].grid(True, alpha=0.3, axis="y")

plt.tight_layout()
plt.savefig("operation_comparison.png", dpi=300, bbox_inches="tight")
print("Chart saved as 'operation_comparison.png'")

# Print summary statistics
print("\n" + "=" * 60)
print("PERFORMANCE SUMMARY")
print("=" * 60)
print(test_results.groupby("Operation")[["AvgTime_ms", "TotalTime_ms"]].describe())
