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

In theory this Vector class can have any number of components, but most methods only make sense for 2D or 3D vector operations. Currently 2D operations remain the best usecase, since I'm usually working in 2D and that's what I write most methods for.

## Documentation

I'll add a list of all the available methods here soon ;)

In the mean time, I recommend just reading the Vector class file. Each method has doc blocks explaining what they do.

## Development & Testing

Currently I test the vector methods manually by creating a `test.ts` where I do some operations and log the results. I then run the file with `npx ts-node test.ts`.

In the future it would be nice to add some unit tests.