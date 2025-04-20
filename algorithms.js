class DiskScheduler {
    constructor(requests, initialHead, diskSize) {
        this.requests = requests.map(Number);
        this.initialHead = Number(initialHead);
        this.diskSize = Number(diskSize);
        this.seekSequence = [];
        this.totalHeadMovement = 0;
    }

    fcfs() {
        this.seekSequence = [this.initialHead, ...this.requests];
        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    sstf() {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];

        while (unserviced.length > 0) {
            let nearestRequest = this.findNearest(currentHead, unserviced);
            currentHead = nearestRequest;
            this.seekSequence.push(currentHead);
            unserviced = unserviced.filter(req => req !== nearestRequest);
        }

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    scan(direction = 'right') {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];

        unserviced.sort((a, b) => a - b);
        
        let index = unserviced.findIndex(req => req >= currentHead);
        let left = unserviced.slice(0, index);
        let right = unserviced.slice(index);

        if (direction === 'right') {
            this.seekSequence.push(...right);
            if (left.length > 0) {
                this.seekSequence.push(this.diskSize - 1);
                this.seekSequence.push(...left.reverse());
            }
        } else {
            this.seekSequence.push(...left.reverse());
            if (right.length > 0) {
                this.seekSequence.push(0);
                this.seekSequence.push(...right);
            }
        }

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    cscan() {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];

        unserviced.sort((a, b) => a - b);
        
        let index = unserviced.findIndex(req => req >= currentHead);
        let left = unserviced.slice(0, index);
        let right = unserviced.slice(index);

        this.seekSequence.push(...right);
        if (left.length > 0) {
            this.seekSequence.push(this.diskSize - 1);
            this.seekSequence.push(0);
            this.seekSequence.push(...left);
        }

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    look(direction = 'right') {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];

        unserviced.sort((a, b) => a - b);
        
        let index = unserviced.findIndex(req => req >= currentHead);
        let left = unserviced.slice(0, index);
        let right = unserviced.slice(index);

        if (direction === 'right') {
            this.seekSequence.push(...right);
            this.seekSequence.push(...left.reverse());
        } else {
            this.seekSequence.push(...left.reverse());
            this.seekSequence.push(...right);
        }

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    clook() {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];

        unserviced.sort((a, b) => a - b);
        
        let index = unserviced.findIndex(req => req >= currentHead);
        let left = unserviced.slice(0, index);
        let right = unserviced.slice(index);

        this.seekSequence.push(...right);
        this.seekSequence.push(...left);

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    nstepScan(n = 3) {
        let currentHead = this.initialHead;
        let unserviced = [...this.requests];
        this.seekSequence = [currentHead];
        
        while (unserviced.length > 0) {
            let batch = unserviced.splice(0, n);
            batch.sort((a, b) => a - b);
            
            let index = batch.findIndex(req => req >= currentHead);
            if (index === -1) index = batch.length;
            
            let right = batch.slice(index);
            let left = batch.slice(0, index).reverse();
            
            this.seekSequence.push(...right, ...left);
            currentHead = this.seekSequence[this.seekSequence.length - 1];
        }

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    fscan() {
        let currentHead = this.initialHead;
        let queue1 = [...this.requests.slice(0, Math.floor(this.requests.length / 2))];
        let queue2 = [...this.requests.slice(Math.floor(this.requests.length / 2))];
        this.seekSequence = [currentHead];

        // Process first queue
        queue1.sort((a, b) => a - b);
        let index1 = queue1.findIndex(req => req >= currentHead);
        if (index1 === -1) index1 = queue1.length;
        this.seekSequence.push(...queue1.slice(index1), ...queue1.slice(0, index1).reverse());

        // Process second queue
        currentHead = this.seekSequence[this.seekSequence.length - 1];
        queue2.sort((a, b) => a - b);
        let index2 = queue2.findIndex(req => req >= currentHead);
        if (index2 === -1) index2 = queue2.length;
        this.seekSequence.push(...queue2.slice(index2), ...queue2.slice(0, index2).reverse());

        this.calculateTotalHeadMovement();
        return {
            seekSequence: this.seekSequence,
            totalHeadMovement: this.totalHeadMovement
        };
    }

    findNearest(head, requests) {
        return requests.reduce((nearest, current) => {
            return Math.abs(current - head) < Math.abs(nearest - head) ? current : nearest;
        });
    }

    calculateTotalHeadMovement() {
        this.totalHeadMovement = 0;
        for (let i = 0; i < this.seekSequence.length - 1; i++) {
            this.totalHeadMovement += Math.abs(this.seekSequence[i + 1] - this.seekSequence[i]);
        }
    }
}
