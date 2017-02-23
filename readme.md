Ways to Approach Big Data Visualization

1) Simplest solution: dynamic simplification with native CanvasJS 
	- use Visvalingham-Whyatt or modified RDP to assign priority values to points on a given line. 
	- use these values to filter points to display if too many (say >200k)
	- to filter points, can use different data structures for efficient 2d range search:
		- kd-tree
		- range tree (seems to be a balanced kd-tree?)
		- r tree
		- simple binary search (assuming x-coordinates in a line are non-decreasing) -- this might not be best solution anyway? why?



Problem with Range Search:
	- inclusive 2D search isn't enough -- not only do we want points inside the bounding box, but we also need 2 points just outside the range on either side, as well as any excluded points in line order for rendering lines headed out of bounds
	- solutions:
		- binary search
			-if we can assume x-coordinates in a line are non-decreasing, we can just binary search by x-coordinate to isolate points  

From Jerry: 
- Goals: display 2 million points? (2000 runs/lines, usually each with 1000 points)

