export class Vector {

    public components: Array<number>

    public get x(): number {
        return this.components[0];
    }

    public set x(x: number) {
        this.components[0] = x;
    }

    public get y(): number {
        return this.components[1];
    }

    public set y(y: number) {
        this.components[1] = y;
    }

    public get z(): number {
        return this.components[2];
    }

    public set z(z: number) {
        this.components[2] = z;
    }

    public get length(): number {
        let res = 0;
        this.components.forEach(component => {
            res += (component * component);
        });
        return Math.sqrt(res);
    }

    constructor(...components: Array<number>) {
        this.components = components
    }

    add(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    subtract(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    scale(scalar: number) {
        return new Vector(...this.components.map(component => component * scalar));
    }

    divide(scalar: number) {
        return new Vector(...this.components.map(component => component / scalar));
    }

    normalize() {
        return this.divide(this.length);
    }

    /**
     * Dot product. Turns two vectors into a single number.
     *
     * @param vector
     */
    dot(vector: Vector): number {
        if (this.components.length !== vector.components.length) {
            throw Error("Vectors must have the same amount of components!");
        }
        let res = 0;
        this.components.forEach((component: number, index: number) => {
            res += (component * vector.components[index]);
        });
        return res;
    }

    angle(): number {
        if (this.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        const origin = new Vector(0, -1)
        const radian = Math.acos(this.dot(origin) / (this.length * origin.length))
        if (this.y * origin.x > this.x * origin.y) {
            return radian * (180 / Math.PI);
        }
        return ((Math.PI * 2) - radian) * (180 / Math.PI);
    }

    distance(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        return Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2));
    }

    angleTo(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors');
        }

        const diff = this.subtract(vector);
        const theta = Math.atan2(diff.x, diff.y);
        return theta * (180 / Math.PI);
    }

    flipComponent(component: number): Vector {
        if(component < 1 || component > this.components.length) throw Error('Vector does not have a '+component+'th component');
        
        const vector = new Vector(...this.components);
        vector.components[component - 1] = -vector.components[component - 1];
        
        return vector;
    }

    flipX(): Vector{
        return this.flipComponent(1);
    }

    flipY(): Vector{
        return this.flipComponent(2);
    }

    flipZ(): Vector{
        return this.flipComponent(3);
    }
}