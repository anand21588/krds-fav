// Functions =============================================================
var List = function () {};

List.prototype._busy = false;

List.prototype.id_link = 0;

List.prototype.validate = function (id)
{
	var _this = this;
	try
	{
		if ($.trim($('#favorite_name_' + id).val()).length === 0)
			throw{msg: 'Fill the Favorites'};

		if ($.trim($('#url_' + id).val()).length === 0)
			throw{msg: 'Fill the url'};

		return true;
	}
	catch (e)
	{
		_this.error('#js_error_' + id, e.msg);
		return false;
	}
};

List.prototype.insertData = function (id)
{
	var _this = this;

	if (_this._busy || !_this.validate(id))
		return false;
	
	var data = {};
	data._id = id;
	data.name = $('#favorite_name_' + id).val();
	data.url = $('#url_' + id).val();
	
	if(_this.id_link > 0)
		data.id = _this.id_link;

	$.post('/users/save', data).done(function (response)
	{		
		if(_this.id_link > 0)
		{
			var ele = $('#fav_'+_this.id_link+'_'+id+' > a').eq(0);
			ele.html(data.name);
			ele.attr('href', data.url);
		}
		else
		{
			var fav = $('#fav_temp').html();
			
			fav = fav.replace(/\{name\}/g, data.name);
			fav = fav.replace(/\{url\}/g, data.url);
			fav = fav.replace(/\{_id\}/g, id);
			fav = fav.replace(/\{id\}/g, response.id);

			$('#category_'+id).append(fav);			
		}
		
		$('#favorite_name_' + id+', #url_'+ id).val('');
		$('#forms_'+id+', #category_'+id).toggle();
	});
};

List.prototype.validateCategory = function (id)
{
	var _this = this;
	
	try
	{
		if ($.trim($('#category_name').val()).length === 0)
			throw{msg: 'Fill the Category'};

		return true;
	}
	catch (e)
	{
		_this.error('#js_error', e.msg);
		return false;
	}
};

List.prototype.insertCategory = function ()
{
	var _this = this;

	if (_this._busy || !_this.validateCategory())
		return false;

	$.post('/users/saveCategory', {name: $('#category_name').val()}).done(function (response)
	{
		if(response._id)
		{
			var category = $('#category_temp').html();
			
			category = category.replace(/\{cat_name\}/g, $('#category_name').val());
			category = category.replace(/\{_id\}/g, response._id);
			
			$(category).insertBefore('.add');
			$('#category_name').val('');
			$('#form_block, #add').toggle();
		}
	});
};

List.prototype.deleteFav = function (_id, id)
{
	var _this = this;

	if (_this._busy)
		return false;

	$.post('/users/deleteFav', {_id: _id, id: id}).done(function (response)
	{
		console.log(response);
		if(response.error === 0)
			$('#fav_'+id+'_'+_id).remove();
	});
};

List.prototype.error = function (ele, msg)
{
	$(ele).hide(0);
	$(ele).html(msg).show(0).delay(5000).hide(0);
};

var list = new List();

// DOM Ready =============================================================
$(document).ready(function ()
{
	$('.category').each(function ()
	{
		var highestBox = 0;

		if ($(this).height() > highestBox)
			highestBox = $(this).height();

		$('.category').height(highestBox);
	});

	$('#wrapper').delegate('#add, #close', 'click', function ()
	{
		$('#form_block, #add').toggle();
		return false;
	});

	$('#wrapper').delegate('.listOfForms', 'submit', function ()
	{
		list.insertData($(this).data('id'));
		return false;
	});

	$('#wrapper').delegate('#category_form', 'submit', function ()
	{
		list.insertCategory();
		return false;
	});
	
	$('#wrapper').delegate('.deleteFav', 'click', function(e)
	{
		e.preventDefault();
		list.deleteFav($(this).data('_id'), $(this).data('id'));
		return false;
	});

	$('#wrapper').delegate('.addFavorites, .close, .editFav', 'click', function (e) 
	{
		e.preventDefault();
		var id = $(this).data('_id'), name = $(this).data('name'), url = $(this).data('url');
		list.id_link = $(this).data('id_link');
		
		if(typeof name != 'undefined' && typeof url != 'undefined')
		{
			$('#favorite_name_'+id).val(name); 
			$('#url_'+id).val(url);
		}
		else
		{
			$('#favorite_name_'+id).val(''); 
			$('#url_'+id).val('');
		}
			
		$('#forms_' + id + ', #category_' + id).toggle();
		return false;
	});
});

