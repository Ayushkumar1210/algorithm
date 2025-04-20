document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new DiskSchedulerVisualizer();
    visualizer.initializeChart();

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    // Set initial theme based on system preference
    setTheme(prefersDarkScheme.matches);

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    // Simulation functionality
    const simulateBtn = document.getElementById('simulate');
    const resetBtn = document.getElementById('reset');
    
    simulateBtn.addEventListener('click', () => {
        const algorithm = document.getElementById('algorithm').value;
        const requestsInput = document.getElementById('requests').value;
        const initialHead = parseInt(document.getElementById('initialHead').value);
        const diskSize = parseInt(document.getElementById('diskSize').value);

        // Validate inputs
        const requests = requestsInput.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
        
        if (requests.length === 0) {
            alert('Please enter valid disk requests');
            return;
        }

        if (isNaN(initialHead) || initialHead < 0 || initialHead >= diskSize) {
            alert('Please enter a valid initial head position');
            return;
        }

        // Create scheduler instance
        const scheduler = new DiskScheduler(requests, initialHead, diskSize);
        let result;

        // Execute selected algorithm
        switch (algorithm) {
            case 'fcfs':
                result = scheduler.fcfs();
                break;
            case 'sstf':
                result = scheduler.sstf();
                break;
            case 'scan':
                result = scheduler.scan('right');
                break;
            case 'cscan':
                result = scheduler.cscan();
                break;
            case 'look':
                result = scheduler.look('right');
                break;
            case 'clook':
                result = scheduler.clook();
                break;
            case 'nstep':
                result = scheduler.nstepScan();
                break;
            case 'fscan':
                result = scheduler.fscan();
                break;
        }

        // Update visualization
        visualizer.updateChart(result.seekSequence);
        visualizer.updateMetrics(result.totalHeadMovement, result.seekSequence);
        visualizer.visualizeSequence(result.seekSequence);
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('requests').value = '';
        document.getElementById('initialHead').value = '50';
        document.getElementById('diskSize').value = '200';
        document.getElementById('algorithm').selectedIndex = 0;
        
        visualizer.initializeChart();
        visualizer.updateMetrics(0, [0]);
        document.getElementById('sequenceContainer').innerHTML = '';
    });
});
