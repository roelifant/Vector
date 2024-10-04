import { IPoint } from "./VectorInterfaces";
import { VectorUtils } from "./VectorUtils";
import { ConstructorVectorError, DimensionsVectorError, IncompatibilityVectorError, MissingComponentVectorError, NoLengthVectorError } from './VectorErrors';

export class Vector {

    /**
     * The components (= the numbers) this vector is made of
     */
    public components: Array<number>;

    /**
     * A collection of utility methods that are useful for vector calculations
     */
    static utils: VectorUtils = new VectorUtils();

    /**
     * The first component of the vector
     */
    public get x(): number {
        return this.components[0];
    }

    /**
     * The first component of the vector
     */
    public set x(x: number) {
        this.components[0] = x;
    }

    /**
     * The second component of the vector
     */
    public get y(): number {
        if (this.components.length < 2) throw new MissingComponentVectorError('Vector has no y component');
        return this.components[1];
    }

    /**
     * The second component of the vector
     */
    public set y(y: number) {
        if (this.components.length < 2) throw new MissingComponentVectorError('Vector has no y component');
        this.components[1] = y;
    }

    /**
     * the third component of the vector
     */
    public get z(): number {
        if (this.components.length < 3) throw new MissingComponentVectorError('Vector has no z component');
        return this.components[2];
    }

    /**
     * the third component of the vector
     */
    public set z(z: number) {
        if (this.components.length < 3) throw new MissingComponentVectorError('Vector has no z component');
        this.components[2] = z;
    }

    /**
     * The length or magnitude of the vector
     */
    public get length(): number {
        let res = 0;
        this.components.forEach(component => {
            res += (component * component);
        });
        return Math.sqrt(res);
    }

    /**
     * Alias for length
     */
    public get magnitude(): number {
        return this.length;
    }

    /**
     * 2 = 2D vector, 3 = 3D vector, and so on
     */
    public get dimensions(): number {
        return this.components.length;
    }

    constructor(...components: Array<number>) {
        if (components.length === 0) throw new ConstructorVectorError('Vector was given no components');
        this.components = components
    }

    /**
     * Creates a vector from the given parameter. Possible inputs are an angle (number), a point (IPoint) or a Vector class instance
     * 
     * @returns vector
     */
    static from(param: number | IPoint | Vector): Vector {
        if (param instanceof Vector) {
            return Vector.fromVector(param);
        }

        if (typeof param === 'number') {
            return Vector.fromAngle(param);
        }

        if (typeof param === 'object') {
            if (param.hasOwnProperty('x') && param.hasOwnProperty('y')) {
                return Vector.fromPoint(param);
            }
        }

        throw new ConstructorVectorError('Could not create Vector');
    }


    /**
     * 
     * Will create a vector from a given point (IPoint)
     * 
     * IPoint has x and y number properties, and optionally a z number property
     * 
     * @param point 
     * @returns vector
     */
    static fromPoint(point: IPoint): Vector {
        if (!!point.z) return new Vector(point.x, point.y, point.z);
        return new Vector(point.x, point.y);
    }

    /**
     * Will create a 2D Vector from a given angle
     * 
     * Angle must be in degrees
     *
     * @param angle
     * @returns vector
     */
    static fromAngle(angle: number): Vector {
        let radians = this.utils.degreesToRadians(angle);
        return new Vector(Math.cos(radians), Math.sin(radians));
    }

    /**
     * Wil return a new copy of the vector
     * @param vector 
     * @returns vector
     */
    static fromVector(vector: Vector): Vector {
        return new Vector(...vector.components);
    }

    /**
     * Add another vector to this vector
     * 
     * A new vector is created where each component is the sum of the component from this vector and the component from the added vector.
     * 
     * @param vector 
     * @returns 
     */
    public add(vector: Vector): Vector {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    /**
     * Subtract another vector from this vector
     * 
     * A new vector is created where each component is the component from the subtracted vector, subtracted from the component of this vector.
     * 
     * @param vector 
     * @returns Vector
     */
    public subtract(vector: Vector): Vector {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    /**
     * Scale the vector by a number
     * 
     * A new vector is created where each component is multiplied by the scalar
     * 
     * @param scalar 
     * @returns vector
     */
    public scale(scalar: number): Vector {
        return new Vector(...this.components.map(component => component * scalar));
    }

    /**
     * Divide the vector by a number
     * 
     * A new vector is created where each component is divided by the scalar
     * 
     * @param scalar 
     * @returns vector
     */
    public divide(scalar: number): Vector {
        return new Vector(...this.components.map(component => component / scalar));
    }

    /**
     * Normalize the vector by altering its components so the vector length = 1
     * 
     * @throws Error - if the vector has a length of 0
     * @returns vector
     */
    public normalize(): Vector {
        if (this.length === 0) throw new NoLengthVectorError('Cannot be normalised because length is 0');
        return this.divide(this.length);
    }

    /**
     * Normalize the vector by altering its components so the vector length = 1
     * 
     * If the vector has a length of 0, the vector will not be normalized
     * 
     * @returns vector
     */
    public normalizeOrRemain(): Vector {
        try {
            return this.normalize()
        } catch (e) {
            return this.copy();
        }
    }

    /**
     * Create the dot product for two vectors. Turns two vectors into a single number.
     *
     * @param vector
     * @returns number
     */
    public dot(vector: Vector): number {
        if (this.components.length !== vector.components.length) {
            throw new IncompatibilityVectorError("Vectors must have the same amount of components!");
        }
        let res = 0;
        this.components.forEach((component: number, index: number) => {
            res += (component * vector.components[index]);
        });
        return res;
    }

    /**
     * Will give the angle from a 2D point vector to another 2D point vector (degrees)
     * 
     * This only works with 2D vectors
     * 
     * @param vector 
     * @returns angle
     */
    public angleTo(vector: Vector): number {
        if (this.components.length !== 2 || vector.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors');
        }

        const diff = this.subtract(vector);
        const theta = Math.atan2(diff.x, diff.y);
        return theta * (180 / Math.PI);
    }

    /**
     * Calculate the distance between 2 2D vectors
     * 
     * @param vector 
     * @returns distance
     */
    public distance(vector: Vector): number {
        if (this.components.length !== 2 || vector.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors!');
        }
        return Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2));
    }

    /**
     * Rotate a 2D vector
     * 
     * @param radians 
     * @returns radians
     */
    public rotate(radians: number) {
        if (this.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors');
        }

        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return new Vector(
            (cos * this.x) - (sin * this.y),
            (sin * this.x) + (cos * this.y),
        );
    }


    /**
     * Flip a component from negative to positive, or from positive to negative
     * 
     * @param component 
     * @returns vector
     */
    public flipComponent(component: number): Vector {
        if (component < 1 || component > this.components.length) throw Error('Vector does not have a ' + component + 'th component');

        const vector = this.copy()
        vector.components[component - 1] = -vector.components[component - 1];

        return vector;
    }

    /**
     * Rotate the vector around an anchor point
     * 
     * @param radians 
     * @param anchor 
     * @returns vector
     */
    public rotateAroundAnchor(radians: number, anchor: Vector | IPoint): Vector {
        if (!(anchor instanceof Vector)) {
            anchor = Vector.from(anchor);
        }

        // first get direction from point to anchor
        const direction = this.subtract(<Vector>anchor);

        // then rotate that direction the desired angle (radian)
        const rotatedDirection = direction.rotate(radians);
        return rotatedDirection.add(<Vector>anchor);
    }

    /**
     * Will get the pependicular vector for a 2D vector
     * 
     * @returns vector
     */
    public perpendicular2D(clockwise: boolean = true): Vector {
        if (this.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors');
        }

        if (clockwise) {
            return new Vector(-this.y, this.x);
        }

        return this.perpendicular2D().perpendicular2D().perpendicular2D();
    }

    /**
     * Creates the cross product (or vector product) of 2 3D vectors
     * 
     * I have to level with you. I have no clue what this even is. But wikipedia does! (https://en.wikipedia.org/wiki/Cross_product) and as far as I can tell it works.
     * 
     * @param vector 
     * @returns vector
     */
    public cross(vector: Vector): Vector {
        if (!(this.components.length === 3) || !(vector.components.length === 3)) {
            throw new DimensionsVectorError('Cross product can only be calculated for 3D vectors!')
        }

        return new Vector(
            this.components[1] * vector.components[2] - this.components[2] * vector.components[1],
            this.components[2] * vector.components[0] - this.components[0] * vector.components[2],
            this.components[0] * vector.components[1] - this.components[1] * vector.components[0]
        )
    }

    /**
     * Iterate over all components and modify each one with a callback function
     * 
     * @param callback 
     * @returns vector
     */
    public map(callback: CallableFunction): Vector {
        const components = [...this.components];
        const result: Array<number> = [];
        components.forEach(component => result.push(callback(component)));
        return new Vector(...result);
    }

    /**
     * Output the vector as a point (x, y, z);
     * 
     * @returns IPoint
     */
    public toPoint(): IPoint {
        if (this.components.length < 2) throw new DimensionsVectorError('Not enough components for point');
        if (this.components.length < 3) return { x: this.x, y: this.y };
        if (this.components.length > 3) console.warn('This vector has too many components for a 3D point. Only the first 3 components were represented in the point output.');
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * Output a 2D vector as an angle (degrees)
     * 
     * @returns degrees
     */
    public toAngle(): number {
        if (this.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors!');
        }
        const origin = new Vector(0, -1)
        const radian = Math.acos(this.dot(origin) / (this.length * origin.length))
        if (this.y * origin.x > this.x * origin.y) {
            return radian * (180 / Math.PI);
        }
        return ((Math.PI * 2) - radian) * (180 / Math.PI);
    }

    /**
     * 
     * Is the vector within a certain distance of another vector?
     * 
     * Only works for 2D vectors
     * 
     * @param vector 
     * @param distance 
     * @returns boolean
     */
    public isNear(vector: Vector, distance: number): boolean {
        if (this.components.length !== 2 || vector.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors!');
        }
        return vector.distance(this) <= distance;
    }

    /**
     * Get the vector for a point vector that is mirrored over another point vector
     * 
     * Only works for 2D vectors
     * 
     * @param reflectionPoint 
     * @returns vector
     */
    public reflectOverPoint(reflectionPoint: Vector): Vector {
        if (this.components.length !== 2 || reflectionPoint.components.length !== 2) {
            throw new DimensionsVectorError('This method only works for two-dimensional vectors!');
        }

        const distance = this.distance(reflectionPoint);
        const dir = reflectionPoint.subtract(this).normalizeOrRemain();
        return this.add(dir.scale(distance * 2));
    }

    /**
     * Calculate the mid point between 2 points
     *
     * @param positionVector
     * @returns vector
     */
    public middle(positionVector: Vector): Vector {
        return this.add(positionVector).divide(2);
    }

    /**
     * Alias for middle() method
     * 
     * @param positionVector 
     * @returns vector
     */
    public midPoint(positionVector: Vector): Vector {
        return this.middle(positionVector);
    }

    /**
     * Flip the first component from negative to positive, or from positive to negative
     * 
     * @returns vector
     */
    public flipX(): Vector {
        return this.flipComponent(1);
    }

    /**
     * Flip the second component from negative to positive, or from positive to negative
     * 
     * @returns vector
     */
    public flipY(): Vector {
        return this.flipComponent(2);
    }

    /**
     * Flip the first component from negative to positive, or from positive to negative
     * 
     * @returns vector
     */
    public flipZ(): Vector {
        return this.flipComponent(3);
    }

    /**
     * Flip all components from negative to positive, or from positive to negative
     * 
     * @returns vector
     */
    public flip(): Vector {
        let vector = this.copy();
        for (let i = 1; i < this.components.length + 1; i++) {
            vector = vector.flipComponent(i);
        }
        return vector.copy();
    }

    /**
     * Point a vector in the opposite direction
     * 
     * Also an alias for flip()
     * 
     * @returns vector
     */
    public opposite(): Vector {
        return this.flip();
    }

    /**
     * Log all components + length
     */
    public log() {
        const components: any = {};
        if (this.components.length <= 3) {
            components['x'] = this.x;
            if (this.components.length > 1) components['y'] = this.y;
            if (this.components.length > 2) components['z'] = this.z;
        } else {
            this.components.forEach((comp, index) => {
                components[index] = comp;
            });
        }

        const object = {
            length: this.length,
            dimensions: this.dimensions,
            ...components,
        };
        console.table(object);
    }

    /**
     * Make a new copy of this vector
     * 
     * @returns vector
     */
    public copy() {
        return Vector.fromVector(this);
    }

    /**
     * Do the components of this vector match the components of another vector?
     * 
     * @param vector 
     * @param accuracy 
     * @returns boolean
     */
    public matches(vector: Vector, accuracy: number = 3): boolean {
        if (this.components.length !== vector.components.length) {
            return false;
        }

        for (let i = 0; i < this.components.length; i++) {
            const thisComp = this.components[i];
            const otherComp = vector.components[i];

            if (Vector.utils.roundToNDecimals(thisComp, accuracy) !== Vector.utils.roundToNDecimals(otherComp, accuracy)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Does the direction of this vector match the direction of another vector
     * 
     * @param vector 
     * @param accuracy 
     * @returns boolean
     */
    public matchesDirection(vector: Vector, accuracy: number = 3): boolean {
        const normalizedSelf = this.normalizeOrRemain();
        const normalizedVector = vector.normalizeOrRemain();

        return normalizedSelf.matches(normalizedVector, accuracy);
    }

    /**
     * Does the direction of this vector match the direction of another vector, OR the opposite direction
     * 
     * @param vector 
     * @param accuracy 
     * @returns boolean
     */
    public isParallelTo(vector: Vector, accuracy: number = 3): boolean {
        if (this.length === 0 || vector.length === 0) {
            throw new NoLengthVectorError('Both vectors need to be lines. Length cannot be zero.')
        }
        return this.matchesDirection(vector, accuracy) || this.matchesDirection(vector.opposite(), accuracy);
    }

    /**
     * Project this position vector onto a line drawn between the lineStart and lineEnd vectors
     * 
     * @param lineStart 
     * @param lineEnd 
     * @returns vector
     */
    public projectToLineSegment(lineStart: Vector, lineEnd: Vector): Vector {
        const AB = lineEnd.subtract(lineStart);
        const AC = this.subtract(lineStart);

        const AD = AB.scale(AC.dot(AB)).divide(AB.dot(AB));

        return lineStart.add(AD);
    }

    /**
     * Modify the vector so its length equals the given number
     * 
     * @param length
     * @returns vector
     */
    public setLength(length: number): Vector {
        if(this.length === 0){
            throw new NoLengthVectorError('Cannot set length on a vector that has no direction.');
        }

        return this.normalize().scale(length);
    }

    /**
     * Alias for setLength()
     * 
     * @param magnitude 
     * @returns vector
     */
    public setMagnitude(magnitude: number): Vector {
        return this.setLength(magnitude);
    }

    /**
     * Modify the vector so its length is equal to the original length + the given addition number
     * 
     * @param addition 
     * @returns vector
     */
    public addLength(addition: number): Vector {
        if(addition < 0) {
            return this.subtractLength(-addition);
        }

        if(this.length === 0){
            throw new NoLengthVectorError('Cannot add length to a vector with a starting length of zero.');
        }

        const newLength = this.length + addition;

        return this.setLength(newLength);
    }

    /**
     * Alias for addLength()
     * 
     * @param addition 
     * @returns vector
     */
    public addMagnitude(addition: number): Vector {
        return this.addLength(addition);
    }

    /**
     * Modify the vector so its length is equal to the original length - the given subtraction number
     * 
     * @param subtraction 
     * @returns 
     */
    public subtractLength(subtraction: number): Vector {
        if(subtraction < 0) {
            return this.addLength(-subtraction);
        }

        if(this.length === 0){
            throw new NoLengthVectorError('Cannot subtract length from a vector with a starting length of zero.');
        }

        const originalLength = this.length;
        const newLength = originalLength - subtraction;

        if(newLength < 0) {
            return new Vector(0, 0);
        }

        return this.setLength(newLength);
    }

    /**
     * Alias for subtractLength()
     * 
     * @param subtraction 
     * @returns vector
     */
    public subtractMagnitude(subtraction: number): Vector {
        return this.subtractLength(subtraction);
    }
}