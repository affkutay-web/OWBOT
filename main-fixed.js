// main-fixed.js (Cutt.ly API entegrasyonlu)
// Kullanıcı kendi API anahtarını buraya yazmalı
const API_KEY = "e12d776d63512216390ac046aab33ca0";

document.addEventListener("DOMContentLoaded", () => {
    const chartDom = document.getElementById("performanceChart");
    const myChart = echarts.init(chartDom);
    let currentPeriod = "daily";
    let linksCache = [];

    // =============================
    // Cutt.ly API çağrıları
    // =============================
    async function fetchAllLinks() {
        const url = `https://cutt.ly/api/api.php?key=${API_KEY}&links`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.urlList) {
            return Object.values(data.urlList);
        }
        return [];
    }

    async function fetchLinkStats(shortLink) {
        const url = `https://cutt.ly/api/api.php?key=${API_KEY}&stats=${shortLink}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.stats) {
            return data.stats;
        }
        return null;
    }

    // =============================
    // Dashboard Güncelleme
    // =============================
    async function updateMetrics() {
        try {
            const links = await fetchAllLinks();
            linksCache = links;

            // toplam tıklama
            let totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
            document.getElementById("totalClicks").textContent = totalClicks.toLocaleString("tr-TR");

            // bugünkü tıklama (örnek: ilk linkin istatistikleri üzerinden)
            if (links.length > 0) {
                const stats = await fetchLinkStats(links[0].shortLink);
                if (stats && stats.title) {
                    let todayClicks = stats.stats.day[Object.keys(stats.stats.day).pop()];
                    document.getElementById("todayClicks").textContent = todayClicks.toLocaleString("tr-TR");
                }
            }

            // aktif linkler
            document.getElementById("activeLinks").textContent = links.length;

            // son güncelleme
            const now = new Date();
            document.getElementById("lastUpdateTime").textContent = now.toLocaleTimeString("tr-TR", {hour: "2-digit", minute:"2-digit"});
            document.getElementById("lastUpdate").textContent = "Az önce güncellendi";

            // grafik verisini ilk link için doldur
            if (links.length > 0) {
                const stats = await fetchLinkStats(links[0].shortLink);
                if (stats && stats.stats.day) {
                    const dates = Object.keys(stats.stats.day);
                    const values = Object.values(stats.stats.day);

                    renderChart(dates, values);
                }
            }
        } catch (err) {
            console.error("Cutt.ly API Hatası:", err);
        }
    }

    // =============================
    // Grafik Çizimi
    // =============================
    function renderChart(labels, values) {
        const option = {
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: labels },
            yAxis: { type: "value" },
            series: [
                {
                    data: values,
                    type: "line",
                    smooth: true,
                    areaStyle: { color: "rgba(66, 165, 245, 0.2)" },
                    lineStyle: { color: "#42a5f5", width: 3 },
                    symbol: "circle",
                    symbolSize: 6,
                    itemStyle: { color: "#1e88e5" }
                }
            ]
        };
        myChart.setOption(option);
    }

    // =============================
    // Event Listeners
    // =============================
    document.getElementById("refreshBtn").addEventListener("click", updateMetrics);

    document.getElementById("exportBtn").addEventListener("click", () => {
        if (linksCache.length === 0) return;

        const rows = [["Kısa Link", "Tıklama"]];
        linksCache.forEach(link => {
            rows.push([link.shortLink, link.clicks]);
        });

        let csvContent = "data:text/csv;charset=utf-8," 
            + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "rapor.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // İlk yükleme
    updateMetrics();
});
