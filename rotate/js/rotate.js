// a：旋转角度，p：概率（1代表100%），t：显示的中奖信息
		var result_angle = [
		  {a:0,p:0.1,t:'很遗憾'},
		  {a:45,p:0.1,t:'10元话费'},
		  {a:90,p:0.1,t:'京东30元优惠券'},
		  {a:135,p:0.3,t:'滴滴出行大礼包'},
		  {a:180,p:0.1,t:'电子秤一台'},
		  {a:225,p:0.1,t:'小米运动手环一个'},
		  {a:270,p:0.1,t:'中奖五百万'},
		  {a:315,p:0.1,t:'小米5一部'}
		];

		var rotate = {
			rotate_angle : 0, //起始位置为0
			flag_click : true, //转盘转动过程中不可再次触发
			calculate_result:function(type,during_time){      //type:0,箭头转动,1,背景转动;during_time:持续时间(s)
				var self = this;
				type = type || 0; // 默认为箭头转动
				during_time = during_time || 1; // 默认为1s

				var rand_num = Math.ceil(Math.random() * 100); // 用来判断的随机数，1-100

				var result_index; // 最终要旋转到哪一块，对应result_angle的下标
				var start_pos = end_pos = 0; // 判断的角度值起始位置和结束位置

				for(var i in result_angle){
				    // 定义每个区块的起始值
					start_pos = end_pos + 1; // 区块的起始值
					end_pos = end_pos + 100 * result_angle[i].p; // 区块的结束值

					if(rand_num >= start_pos && rand_num <= end_pos){ // 如果随机数落在当前区块，那么获取到最终要旋转到哪一块
						result_index = i;
						break;
					}
				}

				var rand_circle = Math.ceil(Math.random() * 2) + 1; // 附加多转几圈，2-3

				self.flag_click = false; // 旋转结束前，不允许再次触发
				if(type == 1){ // 转动盘子
					self.rotate_angle =  self.rotate_angle - rand_circle * 360 - result_angle[result_index].a - self.rotate_angle % 360;
					$('#i_bg').css({
						'transform': 'rotate('+self.rotate_angle+'deg)',
						'-ms-transform': 'rotate('+self.rotate_angle+'deg)',
						'-webkit-transform': 'rotate('+self.rotate_angle+'deg)',
						'-moz-transform': 'rotate('+self.rotate_angle+'deg)',
						'-o-transform': 'rotate('+self.rotate_angle+'deg)',
						'transition': 'transform ease-out '+during_time+'s',
						'-moz-transition': '-moz-transform ease-out '+during_time+'s',
						'-webkit-transition': '-webkit-transform ease-out '+during_time+'s',
						'-o-transition': '-o-transform ease-out '+during_time+'s'
					});
				}else{ // 转动指针
					self.rotate_angle = self.rotate_angle + rand_circle * 360 + result_angle[result_index].a - self.rotate_angle % 360;
					$('#i_cont').css({
						'transform': 'rotate('+self.rotate_angle+'deg)',
						'-ms-transform': 'rotate('+self.rotate_angle+'deg)',
						'-webkit-transform': 'rotate('+self.rotate_angle+'deg)',
						'-moz-transform': 'rotate('+self.rotate_angle+'deg)',
						'-o-transform': 'rotate('+self.rotate_angle+'deg)',
						'transition': 'transform ease-out '+during_time+'s',
						'-moz-transition': '-moz-transform ease-out '+during_time+'s',
						'-webkit-transition': '-webkit-transform ease-out '+during_time+'s',
						'-o-transition': '-o-transform ease-out '+during_time+'s'
					});
				}
				// 旋转结束后，允许再次触发
				setTimeout(function(){ 
					self.flag_click = true;
					// 告诉结果
					alert(result_angle[result_index].t);
				},during_time*1000);
			}
		}
		$(document).ready(function(){
		
			$('#i_btn').click(function(){
				if(rotate.flag_click){ // 旋转结束前，不允许再次触发
					rotate.calculate_result(1,1);
				}
			});
		});