class DiskSchedulerVisualizer {
    constructor() {
        this.chart = null;
        this.seekTimePerTrack = 5; // 5ms per track movement
    }

    initializeChart() {
        const ctx = document.getElementById('seekGraph').getContext('2d');
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Head Movement',
                    data: [],
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--primary-color'),
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Track Number'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Request Sequence'
                        }
                    }
                },
                animation: {
                    duration: 1000
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Disk Head Movement Visualization'
                    }
                }
            }
        });
    }

    updateChart(seekSequence) {
        const labels = seekSequence.map((_, index) => `Step ${index}`);
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = seekSequence;
        this.chart.update();
    }

    updateMetrics(totalHeadMovement, seekSequence) {
        const totalSeekTime = totalHeadMovement * this.seekTimePerTrack;
        const avgSeekTime = totalSeekTime / (seekSequence.length - 1);

        document.getElementById('totalHeadMovement').textContent = totalHeadMovement;
        document.getElementById('seekTime').textContent = `${totalSeekTime} ms`;
        document.getElementById('avgSeekTime').textContent = `${avgSeekTime.toFixed(2)} ms`;
    }

    visualizeSequence(seekSequence) {
        const container = document.getElementById('sequenceContainer');
        container.innerHTML = '';

        seekSequence.forEach((track, index) => {
            const step = document.createElement('div');
            step.className = 'sequence-step';
            step.style.cssText = `
                padding: 0.5rem;
                background-color: var(--card-background);
                border-radius: 4px;
                text-align: center;
                min-width: 60px;
            `;

            if (index > 0) {
                const arrow = document.createElement('span');
                arrow.textContent = '→';
                arrow.style.margin = '0 0.5rem';
                container.appendChild(arrow);
            }

            step.textContent = track;
            container.appendChild(step);
        });
    }
}
