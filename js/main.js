var Main = (function(){
	
	var run = false;
	
	var Form = React.createClass({
		componentDidMount: function() {
			ReactDOM.findDOMNode(this.refs.count).focus();
		},
		onBtnClickHandler: function(e) {
			e.preventDefault();
			var count = ReactDOM.findDOMNode(this.refs.count).value;
			run = false;
			function distance(x1,y1,x2,y2){
				return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
			}

			ReactDOM.render(
				<canvas id='mainScene'></canvas>,
				document.getElementById('result')
			);

			document.getElementById('runBtn').setAttribute('class','');

			var mCanv = document.getElementById('mainScene');
			var i, bg = new Image();
			bg.src = 'i/img.jpg';
			var mCtxt = mCanv.getContext('2d');
			bg.addEventListener('load',function(){
				mCanv.width = this.width;
				mCanv.height = this.height;
				for(i=0; i<count; i++){
					circles[i] = new Circle();
				}
			});

			var circles=[];

			var Circle = function(){
				this.radius = 10+Math.random()*20;
				this.x = this.radius + ( Math.random() * (mCanv.width - this.radius*2));
				this.y = this.radius + ( Math.random() * (mCanv.height - this.radius*2));
				this.dx =  Math.random() * 2 - 1;
				this.dy =  Math.random() * 2 - 1;
				this.run = true;
				this.hover = false;
				function getRndNum(max){
					return Math.round(Math.random()*max);
				}
				this.color = 'rgba('+getRndNum(255)+','+getRndNum(255)+','+getRndNum(255)+','+(Math.random()*.3+.5)+')';
				return this;
			};

			mCanv.addEventListener('click',function(e){

				for(i=0; i<circles.length; i++){
					var dst = distance(e.clientX-mCanv.offsetLeft-1, e.clientY-mCanv.offsetTop-1, circles[i].x, circles[i].y);
					if(dst < circles[i].radius){
						circles[i].run=!circles[i].run;
					}
				}

			});

			mCanv.addEventListener('mousemove',function(e){
				for(i=0; i<circles.length; i++){
					var dst = distance(e.clientX-mCanv.offsetLeft-1, e.clientY-mCanv.offsetTop-1, circles[i].x, circles[i].y);
					if(dst < circles[i].radius){
						circles[i].hover=true;
					}else{
						circles[i].hover=false;
					}
				}
			});

			requestAnimationFrame(function mainLoop(){
				mCtxt.drawImage(bg,0,0);
				for(i=0; i<circles.length; i++){
					if(run===true){
						if(circles[i].run===true){
							circles[i].x += circles[i].dx; 
							circles[i].y += circles[i].dy;
						}
						
						if(circles[i].x+circles[i].radius > mCanv.width)
							circles[i].x = mCanv.width-circles[i].radius;
						if(circles[i].x-circles[i].radius < 0)
							circles[i].x = circles[i].radius;
						if(circles[i].y+circles[i].radius > mCanv.height)
							circles[i].y = mCanv.height-circles[i].radius;
						if(circles[i].y-circles[i].radius < 0)
							circles[i].y = circles[i].radius;
						
						if(circles[i].x+circles[i].radius >= mCanv.width 
							|| circles[i].x-circles[i].radius <= 0)
							circles[i].dx *= -1;
						if(circles[i].y+circles[i].radius >= mCanv.height 
							|| circles[i].y-circles[i].radius <= 0)
							circles[i].dy *= -1;

						for(var j=i+1; j<circles.length; j++){
							var dst = distance(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
							if(dst < circles[i].radius+circles[j].radius){

								var dx = circles[i].x-circles[j].x;
								var dy = circles[i].y-circles[j].y;
								var p = dx*dy/Math.pow(dst,2);
								var px = Math.pow(dx/dst,2);
								var py = Math.pow(dy/dst,2);
								var d1 = circles[i].dy*p+circles[i].dx*px-circles[j].dy*p-circles[j].dx*px;
								var d2 = circles[i].dx*p+circles[i].dy*py-circles[j].dx*p-circles[j].dy*py;
								circles[i].dx-=d1;
								circles[i].dy-=d2;
								circles[j].dx+=d1;
								circles[j].dy+=d2;

								p = (circles[i].radius+circles[j].radius-dst)/2; 
								px = p*(dx/dst);
								py = p*(dy/dst);
								circles[i].x+=px;
								circles[i].y+=py;
								circles[j].x-=px;
								circles[j].y-=py;
							}
						}
					}
					mCtxt.beginPath();
					if(circles[i].hover)
						mCtxt.fillStyle = 'red';
					else
						mCtxt.fillStyle = circles[i].color;//'orange';
					
					mCtxt.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI*2);
					mCtxt.fill();


				}
				requestAnimationFrame(mainLoop);
			});

		},
		onRunClickHandler: function(e) {
			e.preventDefault();
			run = !run;
		},
		render: function() {
			return (
				<form className='form'>
					<input
						type='range'
						className='form__count'
						ref='count'
						min = '1'
						max = '100'
					/>

					<button
						className='form__btn'
						onClick={this.onBtnClickHandler}
						ref='send_button'
					>
						send
					</button>
					<button
						className='hide'
						id = 'runBtn'
						onClick={this.onRunClickHandler}
						ref='run_button'
					>
						run
					</button>
				</form>
			);
		}
	});

	var App = React.createClass({
		render: function() {
			return (
				<div className='app'>
					<Form />
					<div id='result'>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render(
		<App />,
		document.getElementById('mainWrapper')
	);

})();
