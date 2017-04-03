# testglobe

Just for Asger and me :)

## Whishlist

- [ ] "Spherical lerp", so camera moves around the globe to a new location (see the `locate` method).
- [ ] "Billboards", so the planes (near the locations) always "look at" the camera, but appears to be in "screenspace" / as "sprites".
- [ ] Smooth mesh, so the country borders are less visible (when all extrusions are the same)


## Running locally

As we're loading resources, Chrome needs to access the files over HTTP (not file://).

If you have node.js installed, use sth like [static-server](https://github.com/nbluis/static-server)

If you have Python installed, 

	//Python 2.x
	python -m SimpleHTTPServer

	//Python 3.x
	python -m http.server

There is more options here: [How_to_run_things_locally](https://threejs.org/docs/#Manual/Getting_Started/How_to_run_things_locally)
