export class ServerStatusListener {

    private isActive: boolean = false;

    constructor(private refreshCallback: () => void,
                public refreshRate: number = 2500) {}

    public activate(): void {
        if (!this.isActive) {
            this.isActive = true;
            this.refresh();
        }
    }

    public deactivate(): void {
        this.isActive = false;
    }

    private refresh(): void {
        if (!this.isActive) {
            return;
        }
        this.refreshCallback();
        setTimeout(() => this.refresh(), this.refreshRate);
    }

}


