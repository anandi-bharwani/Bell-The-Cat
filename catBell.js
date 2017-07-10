var context = null;

var numRows = 10; 
var numCols = 10;
var catCurrentPosition = "" + (numRows*10+numCols)/2;
var dotRadius = 30;
var dotMargin = 5;
var GridSize = numRows*numCols;
var world = [[]];

function onload()
{
	
	console.log("page loaded");
	createCanvas();
}
function createCanvas()
{
	
	
	var dotDiameter = 2 * dotRadius;
	var xMargin = dotDiameter;
	var yMargin = dotDiameter;

	var circleHtml = '';

	//context used to draw the circles
	
	var alternate = true;

	for(var i = 0; i < numRows; i++) 
	{ // i is the row iterator 
		world[i] = [];
		alternate = !alternate;
		for(var j = 0; j < numCols; j++) 
		{ // j is the column iterator
						if(alternate) 
			{
				var x = (j * (dotDiameter + dotMargin)) + xMargin;
				var y = (i * (dotDiameter + dotMargin)) + yMargin;
				circleHtml = circleHtml +  '<circle id = "'+((i*10)+j)+'" cx="'+x+'" cy="'+y+'" r="'+dotRadius+'"  onClick="circleClick(this.id)"/>';
			}
			else
			{
				var x = (j * (dotDiameter + dotMargin)) + xMargin + dotRadius;
				var y = (i * (dotDiameter + dotMargin)) + yMargin ;
				circleHtml = circleHtml +  '<circle id = "'+((i*10)+j)+'" cx="'+x+'" cy="'+y+'" r="'+dotRadius+'" onClick="circleClick(this.id)"/>';
			}
			//drawDot(x, y, dotRadius); 
			/*if(Math.random()>0.8)
			{
				world[i][j] = 1;
				document.getElementById(i+j).style.fill = "darkslateblue";
			}
			else*/
			world[i][j] = 0;
		} 
	}

	
	document.getElementById("gameSvg").innerHTML = circleHtml;
	catMove(catCurrentPosition);
	document.getElementById("cat").style.position = "absolute";
	RandomNodesSelected(5);
}

function catMove(id)
{
	var rect = document.getElementById(id).getBoundingClientRect();
	document.getElementById("cat").style.left = (rect.left+dotRadius-13)+"px";
	document.getElementById("cat").style.top = (rect.top+dotRadius-13)+"px";
	catCurrentPosition = id;
}
function RandomNodesSelected(countOfNodes)
{
	for(var i = 0 ; i < countOfNodes; i++)
	{
		var nodeId = Math.floor(Math.random() * numRows*numCols);
		while(world[parseInt(nodeId/10)][nodeId%10] == 1)
		{
			nodeId = Math.floor(Math.random() * numRows*numCols);
		}
		selectCircle(nodeId);
	}
	
}
function Reset()
{
	for(var i =0 ;i < numRows*numCols; i++)
	{
		document.getElementById(i).style.fill = "#6495ED";
	}
	catCurrentPosition = "" + (numRows*10+numCols)/2;
	catMove(catCurrentPosition);

	for(var i = 0; i < numRows; i++)
	{

		for(var j=0; j<numCols; j++)
		{
			/*if(Math.random()>0.8)
			{
				world[i][j] = 1;
				document.getElementById(i+j).style.fill = "darkslateblue";
			}
			else*/
			world[i][j] = 0;
		}
	}
	RandomNodesSelected(5);
}
function selectCircle(circleId)
{
	document.getElementById(circleId).style.fill = "darkslateblue";
	//setAttribute("fill","darkslateblue");

	//Add the wall to the world
	world[parseInt(circleId/10)][circleId%10] = 1;
}
function circleClick(circleId)
{	
	var id = parseInt(circleId)
	console.log("circle clicked"+circleId);
	selectCircle(id);
	// find next step of cat
	var catStep = findPath(parseInt(catCurrentPosition));
	if(catStep == -1)
		alert("Error Occured");
	
	catMove(String(catStep));
	if(isGoalNode(catStep))
		alert("Sorry you lost!");
}


function distFromGoal(id)
{
	var row = parseInt(id/10);
	var column = id%10;
	var d1,d2;
	if(row>=5)
		d1 = 9-row;
	else 
		d1 = row;

	if(id[1]>=5)
		d2 = 9-column;
	else 
		d2 = column;

	return Math.min(d1,d2);
}
//Node function, returns object with node values
function Node(parentNode, currentId)
{
	var newNode = {
		id: currentId,
		parentNode: parentNode,
		f:0,
		g:0
	};

	return newNode;
}

function findNeighbours(circleId)
{
	circleIdRow = parseInt(circleId / 10);
	circleIdColumn = circleId%10;
	result = [];

	var nb = circleIdRow*10  + (parseInt(circleIdColumn)+1);
	if((parseInt(circleIdColumn)+1) < 10  && canWalkHere(nb))
		result.push(parseInt(nb));

	nb = circleIdRow*10  + (circleIdColumn-1);
	if(parseInt(circleIdColumn -1) >= 0 && canWalkHere(nb))
		result.push(parseInt(nb))

	nb = (circleIdRow +1)*10 + circleIdColumn;
	if((parseInt(circleIdRow )+1) < 10  && canWalkHere(nb))
		result.push(parseInt(nb));

	nb = (circleIdRow -1)*10 + circleIdColumn;
	if(parseInt(circleIdRow  -1) >= 0 && canWalkHere(nb))
		result.push(parseInt(nb))

	if( circleIdRow %2==0)
	{
		nb = (circleIdRow+1)*10  + (parseInt(circleIdColumn)+1);
		if((parseInt(circleIdRow )+1) < 10  && (parseInt(circleIdColumn)+1) < 10 && canWalkHere(nb))
			result.push(parseInt(nb));

		nb = (circleIdRow-1)*10+ (parseInt(circleIdColumn)+1);
		if((parseInt(circleIdColumn)+1) < 10 && parseInt(circleIdRow  -1) >= 0 && canWalkHere(nb))
			result.push(parseInt(nb))
	}
	else
	{
		nb = (parseInt(circleIdRow )+1)*10 + (parseInt(circleIdColumn)-1);
		if((parseInt(circleIdRow )+1) < 10  && parseInt(circleIdColumn -1) >= 0 && canWalkHere(nb))
			result.push(parseInt(nb));

		nb = (parseInt(circleIdRow)-1)*10 +(parseInt(circleIdColumn)-1);
		if(parseInt(circleIdRow  -1) && parseInt(circleIdColumn -1) >= 0 && canWalkHere(nb))
			result.push(parseInt(nb))
	}
	return result;
}

function isGoalNode(circleId)
{
	circleIdRow = parseInt(circleId/10);
	circleIdColumn = circleId%10;
	if( circleIdRow ==0 || circleIdRow ==9 || circleIdColumn ==0 || circleIdColumn ==9)
		return true;
	else
		return false;
}

function canWalkHere(id)
{
	if(world[parseInt(id/10)][id%10]==0)
		return true;
	else
		return false;
}

function removeChoice(frontier)
{
	var min = numCols*numRows;
	var choice = 0;
	for(var i =0; i<frontier.length; i++)
	{
		if(frontier[i].f+frontier[i].g < min)
		{
			min = frontier[i].f + frontier[i].g;
			choice = i;
		}
	}
	var myNode = frontier.splice(choice, 1)[0];
	return myNode;
}
//A-start algorithm; id is the source node
function findPath(id)
{
	var frontier = []
	frontier.push(Node(0,id));

	var visited = new Array(100);
	for(var i =0; i<100; i++)
		visited[i]=0;
	visited[id]=1;
	var myNode;
	var myNeighbours;
	var myPath;
	var nextCatStep = -1;

	while(frontier.length)
	{
		myNode = removeChoice(frontier);
		
		var curId = myNode.id;
		visited[myNode.id] = 1;
		if(isGoalNode(curId))
		{
			// Reached Goal -- move cat towards this path
			var temp = myNode;
			
			while(temp.id != id)
			{
				nextCatStep = temp.id;
				temp = temp.parentNode;
			}

			return nextCatStep;
		}
		else
		{
			myNeighbours = findNeighbours(myNode.id)
			for(var i = 0; i < myNeighbours.length; i++)
			{
				if( visited[myNeighbours[i]] == 0)
				{
					//Get the next node
					myPath = Node(myNode, myNeighbours[i]);
					//Calculate the cost travelled so far
					myPath.g = myNode.g + 1;
					//Calculate the cost to the estimated goal
					myPath.f = distFromGoal(myPath.id);		

					

					frontier.push(myPath);
				}
			}
		}
	}

	console.log("error");
}