$(function(){

	var arr = [];
	verifyEvent();
	column();

	// 获取数据
	function column(parameter){
		var handler = parameter?parameter:getColum;
		$.get("http://120.78.164.247:8099/manager/category/findAllCategory",handler);
	}
	// 把数据渲染到页面
	function getColum(result){
		var html = template('col-tm', result);
		$('#col-table').html(html);
	}
	//修改
	$("table").on("click","i.change",function(){
		$('#mymodal').modal("show");
		$(".md-title").text("修改栏目信息");
		var id = $(this).parents("td").data("id");
		var parentId = $(this).parents("td").data("parent");
		getModalData(id,parentId);
	})
	// 删除
	$("table").on("click","i.delete",function(){
		var id = $(this).parents("td").data("id");
		$.get("http://120.78.164.247:8099/manager/category/deleteCategoryById",{id:id},function(){
			column();
			tipsAnimate("删除成功");
		})
	})
	// 批量删除
	$(".dele-mun").click(function(){
		var $check = $("td input:checked");
		if($check.length){
			var dataId = [];
			for(var i = 0 , len = $check.length ; i < len ; i++){
				var id = $check.eq(i).parents("td").nextAll("td:last").data("id");
				dataId.push(id);
			}
			var data = {
				ids: dataId.toString()
			}
			$.post("http://120.78.164.247:8099/manager/category/batchDeleteCategory",data,function(){
				column();
				tipsAnimate("删除成功！");
				$(".alert").fadeIn(500,function(){

				})
				tipsAnimate("可能有些数据没有权限，没有删除！",$(".alert"))
			});
		}else{
			tipsAnimate("请选择内容");
		}
	});
	// 提示框
	function tipsAnimate(text,ele){
		var $element = ele?ele:$(".dele-tips");
		$element.find("span").text(text);
		$element.fadeIn(500,function(){
			setTimeout(function(){
				$element.fadeOut(800);
			},500)
		});
	}

	// 全选
	$("th:first").click(function(){
		$(this).toggleClass("all");
		if($(this).hasClass("all")){
			$("input[type='checkbox']").prop("checked",true);
		}else{
			$("input[type='checkbox']").prop("checked",false);
		}
	})

	// 非空
	function require(ele){
		if(!ele.val()){
			ele.prev().addClass("warning");
			return 0;
		}else{
			ele.prev().removeClass("warning");
			return 1;
		}
	}
	// 模态框显示 获取父栏目
	$('#mymodal').on('show.bs.modal',getModalData);
	function getModalData(id,parentId){
		column(function(result){
			var data = result.data;
			$("select").children(":not(:first)").remove();
			for(var i in data){
				var select = data[i].id==parentId?"selected":"";
				var $opt = $("<option value='"+data[i].id+"' "+select+">"+
								data[i].name+"</option>");
				if(data[i].id==id){
					$("#lm-name").val(data[i].name);
					$("#describe").val(data[i].comment);
					$("select").data("current-id",id);
				}
				$("select").append($opt);
			}
		});
	}
	// 清空模态框内容
	$('#mymodal').on('hide.bs.modal',function(){
		$("#add-user").get(0).reset();
		$(".modal-body p").removeClass("warning");
		$("select").removeData("current-id");
	});
	// 表单验证
	function verifyEvent(){
		$("#lm-name").blur(function(){
			arr[0] = require($(this));
		})
		$("#describe").blur(function(){
			arr[1] = require($(this));
		})
	}
	// 增加栏目
	$("button.add").click(function(){
		$(".md-title").text("添加栏目");
	})
	$("#add-confirm").click(addColumn);
	function addColumn(){
		var id = $("select").data("current-id");
		if(id){
			var key = true;
		}else{
			var key = arr.every(function(item,index,arr){
				return item > 0;
			})
			if(!arr.length){
				$("#lm-name").blur();
				$("#describe").blur();
				key = false;
			}
		}
		if($("select option:selected").index()>0){
			var parent = $("option:selected").val();
		}
		if(key){
			var dataAdd = {
				id: id,
				name: $("#lm-name").val(),
				comment: $("#describe").val(),
				parentId: parent
			}
			$.post("http://120.78.164.247:8099/manager/category/saveOrUpdateCategory",dataAdd,function(){
				column();
				$('#mymodal').modal('hide');
				var text = id?"修改成功":"增加成功";
				tipsAnimate(text);
			})
		}
	}
	// 查找
	$(".btn-search").click(findColumn);
	function findColumn(){
		var cnt = $(".form-control").val();
		column(function(result){
			var data = result.data;
			var arr = [];
			var key = 0;
			if(data.length){
				for(var i in data){
					if(!cnt || data[i].name.match(cnt)){
						arr.push(data[i]);
						key++;
					}
				}
				getColum({data:arr});
				if(!key){
					tipsAnimate("未查找到该栏目信息");
				}else{
					tipsAnimate("查找成功");					
				}
			}
		})
	}

})
