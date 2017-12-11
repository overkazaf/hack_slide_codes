(function() {
	var canvas = document.getElementById('canvas-base');
	var img = document.getElementById('image-base');
	var ctx = canvas.getContext('2d');
	var baseHash = [];
	
	var canvasTest = document.getElementById('canvas-test');
	var imgTest = document.getElementById('image-test');
	var ctxTest = canvasTest.getContext('2d');
	var testHash = [];
	
	var size = {width:360, height:220, x:20, y:20};
	
	var ofsAdd = 2;
	var lineNumber = Math.round( (size.width - ofsAdd) / ofsAdd );
	
	var poorPositionOffset;
	getPoor();
	
	img.onload = function(e) {
		
	  console.log("load base");	
	  canvas.width = size.width;
	  canvas.height = size.height;
	  ctx.drawImage(img, -size.x, -size.y);
	  
	  baseHash = getHash(ctx);
	  loaded();
	}
	
	imgTest.onload = function(e) {
	  canvasTest.width = size.width;
	  canvasTest.height = size.height;  
	  ctxTest.drawImage(imgTest, -size.x, -size.y);
	  
	  console.log("load test");
	  
	  testHash = getHash(ctxTest);
	  loaded();
	}
	
	var loadNumber = 0, imgNumber = 3;
	function loaded() {
		loadNumber++;
		if(loadNumber == imgNumber)
			compare();
	}
	
	/**
	 * 读取图片像素
	 */
	function getHash(ctx) {
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var hashList = [];
		
		var points = [];
		var len = imageData.data.length;
		
		for(var i = 0; i < len; i+=4) {
			var j = i / 4,
				n = Math.floor( (j % size.width) / ofsAdd ),
				row = Math.floor( j / size.width / ofsAdd ),
				k1 = row * lineNumber + n;
			
			//var tmp = 0.3*imageData.data[i] + 0.59*imageData.data[i+1] + 0.11 * imageData.data[i+2];
			var tmp = [imageData.data[i], imageData.data[i+1], imageData.data[i+2]];
			//var tmp = Math.sqrt( p.r*p.r + p.g*p.g + p.b*p.b );
			
			if(!hashList[k1]) hashList[k1] = [];
			hashList[k1].push( tmp );
		}
		
		return hashList;
	}
	
	/**
	 * 比较两个图片内容， 找到被抠出部分后 补齐
	 */
	function compare() {
		var len = Math.min(baseHash.length, testHash.length),
			min_x = 10000,
			min_y = 10000;
		
		for(var i = 0; i < baseHash.length; i++) {
			
			var diffCount = 0;
			for(var j = 0; j < ofsAdd * ofsAdd; j++) {
				var b = baseHash[i][j], t = testHash[i][j];
				
				var compareVal = Math.sqrt( Math.pow(b[0] - t[0], 2) +  Math.pow(b[1]-t[1], 2) + Math.pow(b[2]-t[2], 2) );
				//var compareVal = 0.3 * (b.r - t.r) +  0.59 * (b.g-t.g) + 0.3 * (b.b - t.b) ;
				
				diffCount += compareVal > 4 ? 1 : 0;
			}
			
			if(diffCount > ofsAdd*ofsAdd*0.2) {
				var sy = Math.floor( i / lineNumber ) * ofsAdd,
					sx = (i % lineNumber) * ofsAdd;
				
				ctx.clearRect(sx, sy, ofsAdd, ofsAdd);
				min_x = Math.min(min_x, sx);
				min_y = Math.min(min_y, sy);
			}
		}
	
		var target_left = 580 + min_x + ofsAdd/2 - poorPositionOffset.x,
			target_top = min_y + ofsAdd/2 - poorPositionOffset.y;
			
			console.log(min_x, min_y);
		
		move(target_left, target_top);
	}
	
	// 被抠出的小图
	function getPoor() {
		var canvas = document.getElementById('canvas-poor'),
			img = document.getElementById('poor'),
			ctx = canvas.getContext('2d');
		
		img.onload = function(e) {
			canvas.width = img.width;
	    canvas.height = img.height;
	    ctx.drawImage(img, 0, 0);
	    
	    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
	    	len = imageData.data.length,
	    	min_x = 1000, 
	    	min_y = 1000;
	    
			for(var i = 0; i < len; i+=4) {
				if(
					imageData.data[i] < 20
					&& imageData.data[i+1] < 20
					&& imageData.data[i+2] < 20
				) continue;
				
				var j = i / 4;
				min_y = Math.min( Math.floor( j / canvas.width ), min_y );
				min_x = Math.min( j % canvas.width , min_x );
			}
			
			poorPositionOffset = {x:min_x, y:min_y};
			console.log("poor", poorPositionOffset);
			loaded();
		}
	}
	
	// 简易动画
	function move(target_left, target_top) {
		var ele = document.getElementById("poor").style,
			now_top = ele.top.substring(2, -1) * 1,
			now_left = ele.left.substring(ele.left.length-2, -1) * 1;
		
		var n = 30, run_times = 0;
		var add_top = (target_top - now_top) / n;
		var add_left = (target_left - now_left) / n;
		
		var time = setInterval(function() {
			run_times++;
			
			if(run_times > n) {
				ele.top = target_top+"px";
				ele.left = target_left+"px";
				
				clearInterval(time);
				return;
			}
			
			now_top += add_top;
			now_left += add_left;
			
			ele.top = ( now_top )+"px";
			ele.left = ( now_left )+"px";
		}, 30);
	}
})();