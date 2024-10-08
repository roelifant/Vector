# Vector

This code snippet is a simple Vector class in typescript. If there is any calculation you might want to do with vectors, this class has a method for it that will do the math for you.

The default behavior of this class is for each method to return a new instance of the Vector. This way you can chain vector operations like so:

```typescript
const newVector = oldVector
    .middle(otherOldVector)
    .scale(2)
    .opposite()
    .rotate(90)
    .normalize();
//    .andSoOn()

```
The original vector used to start the operation is never altered.

In theory this Vector class can have any number of components, but most methods only make sense for 2D or 3D vector operations. Currently 2D operations remain the best usecase, since I'm usually working in 2D and that's what I write most methods for.

## Documentation

### Configuration

#### Radians or degrees

By default the Vector class accepts and returns radians for all angle values. This behavior can be easily changed by using the static `Vector.useRadians()` or `Vector.useDegrees()` methods before you do your operations.

```typescript
// When this vector is converted to an angle, it should result in an angle of 90 degrees.
// This is rouphly 1.57 radians
const myVector = new Vector(1, 0);

Vector.useRadians() // Configure all vectors to use radians. (This is already the default)

myVector.toAngle(); // 1.5707963267948966

Vector.fromAngle(1.5707963267948966); // [1, 6.12^-17]
// This approximates the correct vector ([1, 0])

Vector.fromAngle(90); // [ -0.4480736161291702, 0.8939966636005579 ]
// This is an incorrect result as it's expecting a radian of 1.57... rather than 90 degrees

Vector.useDegrees(); // Configure all vectors to use degrees.

myVector.toAngle(); // 90

Vector.fromAngle(1.5707963267948966); // [0.027412133592044294, 0.9996242168594817]
// This is an incorrect result as it's expecting 90 degrees rader than a radian of 1.57...

Vector.fromAngle(90); // [1, 6.12^-17]
// This approximates the correct vector ([1, 0])
```

#### Set full configuration

You can also set all config values at once by using the static `Vector.setConfig()` method.

```typescript
Vector.setConfig({
    angles: VectorAngleEnum.radians
});
```

### Methods

I'll add a list of all the available methods here soon ;)

In the mean time, I recommend just reading the Vector class file. Each method has doc blocks explaining what they do.

## Development & Testing

Currently I test the vector methods manually by creating a `test.ts` where I do some operations and log the results. I then run the file with `npx ts-node test.ts`.

In the future it would be nice to add some unit tests.

## Future features

Some more features I have in mind are:

- rounding components
- snapping position vectors to a grid
- global vector settings such as:
    - the default accuracy (to what decimals should be rounded to?)
    - do all methods accept and return radians or degrees by default (currently mixed)
    - is the y axis (or any other axis) inverted?
- more 3D support