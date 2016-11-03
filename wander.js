

// WANDERER OBJECT
function Wanderer(value, type, callback, opts, subtype)
{
	var self = this;

	this.defaultopts = 
	{
		id: self._uuid(),
		scale: 1,

		bounds: { x: 0, y: 0, w: 0, h: 0 },
		speed: 1,

		currentTarget: null
	}

	if(typeof opts !== 'undefined')
	{
		this.opts = opts;

		for(var key in this.defaultopts)
		{
			if(this.defaultopts.hasOwnProperty(key))
			{
				var o = this.defaultopts[key];

				if(typeof this.opts[key] === 'undefined')
				{
					this.opts[key] = this.defaultopts[key];
				}
			}
		}
	}
	else
	{
		this.opts = self.defaultopts;
	}

	this.opts.subtype = subtype;

	this.type = type;
	this.callback = callback;

	this.value = value;
	this.ov = value;

	/*if(this.type.id === Wander.Type.RandomTarget.id)
	{

	}*/
}

Wanderer.prototype.Update = function(dt, t)
{
	this.type.action(dt, t, this);
}

Wanderer.prototype._uuid = function()
{
	function s4() 
	{
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
}


// WANDER STATIC
var Wander = {};

Wander.Type = {};
Wander.Subtype = {};
Wander.wanderers = [];


// WANDER METHODS
Wander.WanderValue = function(value, type, callback, opts)
{
	var w = new Wanderer(value, type, callback, opts, Wander.Subtype.w_value);
	this.wanderers.push(w);
}

Wander.WanderVector = function(vector, type, callback, opts)
{
	var w = new Wanderer(vector, type, callback, opts, Wander.Subtype.w_vector);
	this.wanderers.push(w);
}

Wander.WanderArray = function(array, type, callback, opts)
{
	var w = new Wanderer(array, type, callback, opts, Wander.Subtype.w_array);
	this.wanderers.push(w);
}

Wander.Update = function(dt, t)
{
	if(this.wanderers.length === 0)
		return;

	for(var i = 0; i < this.wanderers.length; i++)
	{
		this.wanderers[i].Update(dt, t);
	}
}


// WANDER TYPE ENUM
Wander.Type.RandomWalk = 
{
	id: 'w_randomwalk',

	action: function(dt, t, w)
	{
		switch(w.opts.subtype)
		{
			case Wander.Subtype.w_value:
				var rv = (chance.bool() ? -1 : 1) * w.opts.scale * dt;

				w.value += rv;
				w.callback(w.value);
				break;

			case Wander.Subtype.w_vector:
				var rx = (chance.bool() ? -1 : 1) * w.opts.scale * dt;
				var ry = (chance.bool() ? -1 : 1) * w.opts.scale * dt;

				w.value = new Vector([rx, ry]);

				w.callback(w.value);
				break;

			case Wander.Subtype.w_array:
				for(var i = 0; i < w.value.length; i++)
				{
					w.value[i] += (chance.bool() ? -1 : 1) * w.opts.scale * dt;
				}

				w.callback(w.value);
				break;

			default:
				break;
		}
		//console.log(w, rx, ry);
	}
}

Wander.Type.Periodic = 
{
	id: 'w_periodic'
}

Wander.Type.RandomTarget = 
{
	id: 'w_randomtarget',

	action: function(dt, t, w)
	{
		switch(w.opts.subtype)
		{
			case Wander.Subtype.w_value:
				var rv = (chance.bool() ? -1 : 1) * w.opts.scale;

				w.value += rv;
				w.callback(w.value);
				break;

			case Wander.Subtype.w_vector:
				if(w.opts.currentTarget === null)
				{
					var rx = chance.integer({ min: w.opts.bounds.x, max: w.opts.bounds.w });
					var ry = chance.integer({ min: w.opts.bounds.y, max: w.opts.bounds.h });
					w.opts.currentTarget = new Vector([rx, ry]);
				}
				
				var angle = Vector.angle(w.value, w.opts.currentTarget);
				var v = Vector.subtract(w.opts.currentTarget, w.value).normalize();

				w.value.add(v.scale(w.opts.scale * dt))

				if(Vector.subtract(w.opts.currentTarget, w.value).magnitude() < 1)
					w.opts.currentTarget = null;

				w.callback(w.value);
				break;

			case Wander.Subtype.w_array:
				for(var i = 0; i < w.value.length; i++)
				{
					w.value[i] += (chance.bool() ? -1 : 1) * w.opts.scale;
				}

				w.callback(w.value);
				break;

			default:
				break;
		}
	}
}

// WANDER SUBTYPE ENUM
Wander.Subtype = 
{
	w_value: 1,
	w_vector: 2,
	w_array: 3
}