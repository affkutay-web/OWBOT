
// main-fixed.js

document.addEventListener("DOMContentLoaded", () => {
    // =============================
    // ECharts Performans Grafiği
    // =============================
    const chartDom = document.getElementById("performanceChart");
    const myChart = echarts.init(chartDom);

    // Örnek veri setleri
    const dataSets = {
        daily: [120, 200, 150, 80, 70, 110, 130],
        weekly: [820, 932, 901, 934, 1290, 1330, 1320],
        monthly: [3200, 2800, 3500, 4100, 3900, 4500, 4700, 5000, 5300, 4900, 5200, 6100]
    };

    let currentPeriod = "daily";

    function renderChart(period) {
        const option = {
            tooltip: { trigger: "axis" },
            xAxis: {
                type: "category",
                data: period === "daily"
                    ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
                    : period === "weekly"
                        ? ["Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4", "Hafta 5", "Hafta 6", "Hafta 7"]
                        : ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]
            },
            yAxis: { type: "value" },
            series: [
                {
                    data: dataSets[period],
                    type: "line",
                    smooth: true,
                    areaStyle: { color: "rgba(66, 165, 245, 0.2)" },
                    lineStyle: { color: "#42a5f5", width: 3 },
                    symbol: "circle",
                    symbolSize: 8,
                    itemStyle: { color: "#1e88e5" }
                }
            ]
        };
        myChart.setOption(option);
    }

    // İlk grafik
    renderChart(currentPeriod);

    // =============================
    // Tab Butonları (Günlük/Haftalık/Aylık)
    // =============================
    document.querySelectorAll(".nav-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentPeriod = btn.getAttribute("data-period");
            renderChart(currentPeriod);
        });
    });

    // =============================
    // Metrik Güncelleme
    // =============================
    function updateMetrics() {
        const totalClicks = Math.floor(Math.random() * 50000) + 10000;
        const todayClicks = Math.floor(Math.random() * 2000) + 500;
        const activeLinks = Math.floor(Math.random() * 10) + 1;

        document.getElementById("totalClicks").textContent = totalClicks.toLocaleString("tr-TR");
        document.getElementById("todayClicks").textContent = todayClicks.toLocaleString("tr-TR");
        document.getElementById("activeLinks").textContent = activeLinks;

        const now = new Date();
        const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        document.getElementById("lastUpdateTime").textContent = timeStr;
        document.getElementById("lastUpdate").textContent = "Az önce güncellendi";
    }

    // Refresh Butonu
    document.getElementById("refreshBtn").addEventListener("click", () => {
        updateMetrics();
    });

    // =============================
    // CSV Export
    // =============================
    document.getElementById("exportBtn").addEventListener("click", () => {
        const rows = [
            ["Tarih", "Tıklamalar"],
            ...(
                currentPeriod === "daily"
                    ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
                    : currentPeriod === "weekly"
                        ? ["Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4", "Hafta 5", "Hafta 6", "Hafta 7"]
                        : ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]
            ).map((label, i) => [label, dataSets[currentPeriod][i]])
        ];

        let csvContent = "data:text/csv;charset=utf-8," 
            + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "rapor.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // İlk metrik seti
    updateMetrics();
});
