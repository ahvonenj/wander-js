# Wander.js

JavaScript Multitype Value "Wandering" Library.

## Dependencies

- [http://chancejs.com/](chance.js)
- [https://github.com/mateogianolio/vectorious](vectorious) (v-4.3.3+)

## General

### Making Wander.js work

First of all, include Wander.js in your project, by using `<script>`-tags for example.

For Wander.js to be able to update the state of everything that is wandering, include the following line in your update-loop:

`Wander.Update(dt, t);`

Where

- dt = deltatime (calculated by you)
- t = current time (calculated by you)

### Wandering types

`Wander.Type.RandomWalk`

Simple random walk wandering.

https://en.wikipedia.org/wiki/Random_walk

`Wander.Type.Periodic`

Sin/Cos -based, periodic wandering. **UNIMPLEMENTED**

`Wander.Type.RandomTarget`

Chooses a random target values and closes up on them. New random target value is chosen after reaching the previous one.
Target values are bounded within `opts.bounds`.

### Wander methods

`Wander.WanderValue(value, type, callback, opts)`

- Value = Some numeric value
- Type = One of the Wander.Types
- Callback = Wander calls this function and supplies "wandered value" of a same type that Wander was supplied with. 
This value should be used to update the value of whatever you are making wander.

- Opts

```
{
   id: <someidstring>,
   scale: <wanderingspeed>
}
```

`Wander.WanderVector(vector, type, callback, opts)`

- Value = Some numeric value
- Type = One of the Wander.Types
- Callback = Wander calls this function and supplies "wandered value" of a same type that Wander was supplied with. 
This value should be used to update the value of whatever you are making wander.

- Opts

```
{
   id: <someidstring>,
   scale: <wanderingspeed>
}
```

`Wander.WanderArray(array, type, callback, opts)`

- Value = Some numeric value
- Type = One of the Wander.Types
- Callback = Wander calls this function and supplies "wandered value" of a same type that Wander was supplied with. 
This value should be used to update the value of whatever you are making wander.

- Opts

```
{
   id: <someidstring>,
   scale: <wanderingspeed>
}
```

**NOTE**

- As of the current version of Wander.js, bounds-option only affects `Wander.Type.RandomTarget` wander type 
and NEEDS to be supplied if using the said wandering type

## Usage

Example of how to make some graphical object wander. Full implementation (such as the actual rendering of the object) is left to you, however you see fit.

**Using Wander.WanderVector with wander type Wander.Type.RandomTarget**

```
// SomeGraphicalObject-class example
function SomeGraphicalObject(x, y)
{
	var self = this;

	this.x = x;
	this.y = y;

	// Some sprite that can be drawn for example
	this.sprite = SpriteDrawnForThisObject();

	// Make this object wander
	Wander.WanderVector(new Vector([self.x, self.y]), Wander.Type.RandomTarget, function(v)
	{
		// Update the xy-coordinates of this object
		self.x = v.get(0);
		self.y = v.get(1);
	}, 
	{
		scale: 5,
		bounds:
		{
			x: 0,
			y: 0,
			w: Global.width, // Canvas width
			h: Global.height // Canvas height
		}
	})
}

SomeGraphicalObject.prototype.Update = function(dt, t)
{
	// Move the sprite in this objects xy-coordinates
	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}
```

