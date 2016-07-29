var bookList = [];

// DOM Ready =============================================================
$(document).ready(function() {
    populateTable('','');
});

    $('#bookList table tbody').on('click', 'tr', updatereviewbook);
    $('#addBookLink').on('click', 'a.linkupdatebook', populateBookData);
    $('#addBookLink').on('click', 'a.linkaddreview', populateBookReview);
    $('#addBookLink').on('click', 'a.linkshowaddbook', showAddBook);
    $('#btnAdd').on('click', addBookData);
    $('#btnAddReview').on('click', addBookReviewData);
    $('#btnUpdate').on('click', updateBookData);
    $('#bookList table tbody').on('click', 'td a.linkdeletebook', deleteBookData);
    $('#bookList table tbody').on('click', 'td a.linkreviewsbook', pupulateReviews);
    $('#btnSearch').on('click', findByData);
    $('#addBookLink').on('click', 'a.linkclearsearch', clearSearch);
    $('#addBookLink').on('click', 'a.linkfindby', findByField);
    $('#bookList table th[name=bookprice]').on('click', sortbypricebookData);
    $('#bookList table th[name=bookrate]').on('click', sortbyratebookData);

function findByField(){
     $("#addReview").hide();
    $(".linkupdatebook").hide();
    $(".linkaddreview").hide();
    $("#addBook").hide();
    $('#findby').show();
}    

// Functions =============================================================
function pupulateReviews(event){
    var tableContent = '';
    event.preventDefault();
    var id = $(this).attr('rel');
    var arrayPosition = bookList.map(function(arrayItem) 
        { return arrayItem._id; }).indexOf(id);

    var thisBookObject = bookList[arrayPosition];
    var bookInfo = '<strong>Title : '+thisBookObject.title;
        bookInfo +='&nbsp; &nbsp;[ISBN :'+thisBookObject.isbn+']';
        bookInfo += '&nbsp;&nbsp;&nbsp;&nbsp; Author :'+thisBookObject.author+'</strong>';

    $('#reviewList #bookInfo').html(bookInfo);

    var reviews = thisBookObject.reviews;
    if(reviews.length > 0){
        $.each(reviews, function(){
            tableContent += '<tr><td><hr></td><td><hr></td><td><hr></td></tr>';
            tableContent += '<tr><th>Name </th><th> &nbsp; : &nbsp;</th>';
            tableContent += '<td>' + this.name + '</td></tr>';
            tableContent += '<tr><th>Reviews </th><th>&nbsp; : &nbsp;</th>';
            tableContent += '<td>' + this.review + '</td></tr>';
            tableContent += '<tr><th>Rating </th><th>&nbsp; : &nbsp;</th>';
            tableContent += '<td><div id=' + this._id + ' tooltip='+ this.rate+'>'+ this.rate+'</div></td></tr>';
            
        });
    } else {
        tableContent = '<tr><td> No reviews for this book.. </td></tr>';
    } 
    
    $('#reviewList table tbody').html(tableContent);
    addReviewRatingStar(reviews);

}

function populateTable(field, value) {

    var queryString ='?field='+ field +'&value='+ value;

    // jQuery AJAX call for JSON
    $.getJSON( '/books/booklist'+ queryString, function( data ) {

        bookList =  data;
        var tableContent = filledTable(data);

        $('#bookList table tbody').html(tableContent);

        $("#addReview").hide();
        $(".linkupdatebook").hide();
        $(".linkaddreview").hide();
        $("#addBook").hide();
        $('#findby').hide();
        addAvgRatingStar();
    });
};

function populateBookData(event){

    event.preventDefault();
    $(".linkupdatebook").hide();
    $(".linkaddreview").hide();
    $("#addBook").show();
     var id = $(this).attr('rel');

    var arrayPosition = bookList.map(function(arrayItem) 
        { return arrayItem._id; }).indexOf(id);

    var thisBookObject = bookList[arrayPosition];

    //Populate Book Data
    $('#inputbooktitle').val(thisBookObject.title);
    $('#inputbookisbn').val(thisBookObject.isbn);
    $('#inputbookauthor').val(thisBookObject.author);
    $('#inputbookprice').val(thisBookObject.price/100);
    $('#inputbookrate').val(thisBookObject.average_rate/100);
    $('#hiddenbookid').val(thisBookObject._id);
}
// Add Review
function addBookReviewData(event){
    event.preventDefault();
    var errorCount = 0;
    $('#addReview input[type=text]').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
    if(errorCount === 0) {
         var newReview = {
            'review_name': $('#addReview input#inputbookreviewername').val(),
            'review_dsc': $('#addReview input#inputbookreview').val(),
            'review_rating': $("#reviewrate").rateYo("option", "rating"),
            '_id': $('#addReview input#hiddenreviewbookid').val()
        }
         $.ajax({
            type: 'POST',
            data: newReview,
            url: '/books/addreview',
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.status == 'success') {
                $('#addReview input').val('');
                $("#addReview").hide();
                $(".linkupdatebook").hide();
                $(".linkaddreview").hide();
                $("#addBook").hide();
                $('#findby').hide();
                populateTable('','');
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

}

// Add Book Data
function addBookData(event) {
    event.preventDefault();
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;

    $('#addBook input[type=text]').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    var arrayPosition = bookList.map(function(arrayItem) 
        { return arrayItem.isbn; }).indexOf($('#addBook input#inputbookisbn').val());

    // Check and make sure errorCount's still at zero
    if(errorCount === 0 && arrayPosition === -1) {

        // If it is, compile all user info into one object
        var newBook = {
            'book_title': $('#addBook input#inputbooktitle').val(),
            'book_isbn': $('#addBook input#inputbookisbn').val(),
            'book_price': $('#addBook input#inputbookprice').val(),
            'book_rating': $('#addBook input#inputbookrate').val(),
            'book_author': $('#addBook input#inputbookauthor').val()
        }


        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newBook,
            url: '/books/addbook',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.status == 'success') {

                // Clear the form inputs
                $('#addBook input').val('');
                $("#addReview").hide();
                $(".linkupdatebook").hide();
                $(".linkaddreview").hide();
                $("#addBook").hide();
                $('#findby').hide();

                // Update the table
                populateTable('','');

            }
            else {

                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        if(arrayPosition === -1)
            alert('Please fill in all fields');
        else
            $('#addBook input#inputbookisbn').css({ "border": '#FF0000 1px solid'});

        return false;
    }
};

// Update Book Data
function updateBookData(event) {
    event.preventDefault();
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addBook input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var updateBook = {
            'book_title': $('#addBook input#inputbooktitle').val(),
            'book_isbn': $('#addBook input#inputbookisbn').val(),
            'book_price': $('#addBook input#inputbookprice').val(),
            'book_rating': $('#addBook input#inputbookrate').val(),
            'book_author': $('#addBook input#inputbookauthor').val()
        }


        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: updateBook,
            url: '/books/updatebook/'+ $('#addBook input#hiddenbookid').val(),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.status == 'success') {

                // Clear the form inputs
                $('#addBook input').val('');
                $("#addReview").hide();
                $(".linkupdatebook").hide();
                $(".linkaddreview").hide();
                $("#addBook").hide();
                $('#findby').show();

                // Update the table
                populateTable('','');

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete book data
function deleteBookData(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/books/deletebook/' + $(this).attr('rel')
                }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.status == 'success') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable('','');

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

function populateBookReview(){
    event.preventDefault();
    $(".linkupdatebook").hide();
    $(".linkaddreview").hide();
    $("#addBook").hide();
    $("#addReview").show();
     var id = $(this).attr('rel');

    var arrayPosition = bookList.map(function(arrayItem) 
        { return arrayItem._id; }).indexOf(id);

    var thisBookObject = bookList[arrayPosition];
    $('#labelreviewbooktitle').text(thisBookObject.title);
    $('#labelreviewbookisbn').text(thisBookObject.isbn);
    $('#hiddenreviewbookid').val(thisBookObject._id);

}

function updatereviewbook(){
    $(".linkupdatebook").show();
    $(".linkaddreview").show();
    $('#btnUpdate').show();
    $("#addReview").hide();
    $('#findby').hide();
    $("#addBook").hide();
    $("#btnAdd").hide();
    var id = $(this).attr('rel');
    $('#addBookLink a').each(function() {
        this.rel = id;
    });
    $('.highlight').removeClass("highlight");
    $(this).addClass("highlight");
}

function filledTable(data)
{ 
    var tableContent = '';
    $.each(data, function(){
            tableContent += '<tr class="" rel="' + this._id + '">';
            tableContent += '<td>' + this.isbn + '</td>';
            tableContent += '<td >' + this.title + '</td>';
            tableContent += '<td>' + this.author + '</td>';
            tableContent += '<td>' + this.price/100 + '</td>';
            tableContent += '<td><div id="'+this._id+'">' + this.average_rate/100 + '</div></td>';
            tableContent += '<td> <a href="#" class="linkreviewsbook" rel="' + this._id + '">Reviews [' + this.reviews.length + ']</a></td>';
            tableContent += '<td><a href="#" class="linkdeletebook" rel="' + this._id + '">Delete</a></td>';
            tableContent += '</tr>';
        });
    return tableContent;
}

function sortbypricebookData (){
    if($(this).attr('rel') == 'asc'){
        var op = 'asc';
        $(this).attr('rel', 'desc');
        $('.headerSortDown').removeClass('headerSortDown');
        $('.headerSortUp').removeClass('headerSortUp');
        $(this).addClass('headerSortUp');
    }else{
        $(this).attr('rel', 'asc');
        var op = 'desc';
        $('.headerSortDown').removeClass('headerSortDown');
        $('.headerSortUp').removeClass('headerSortUp');
        $(this).addClass('headerSortDown')
    }   

    bookList.sort(function(a, b){
        if(op == 'asc')
            return a.price > b.price
        else
            return a.price < b.price
    });
    var tableContent = filledTable(bookList);

    $('#bookList table tbody').html(tableContent);
    addAvgRatingStar();
}

function sortbyratebookData (){
    if($(this).attr('rel') == 'asc'){
        var op = 'asc';
        $(this).attr('rel', 'desc');
        $('.headerSortDown').removeClass('headerSortDown');
        $('.headerSortUp').removeClass('headerSortUp');
        $(this).addClass('headerSortUp');
    }else{
        $(this).attr('rel', 'asc');
        var op = 'desc';
        $('.headerSortDown').removeClass('headerSortDown');
        $('.headerSortUp').removeClass('headerSortUp');
        $(this).addClass('headerSortDown');
    } 
    bookList.sort(function(a, b){
        if(op == 'asc')
            return a.average_rate > b.average_rate
        else
            return a.average_rate < b.average_rate
    });
    var tableContent = filledTable(bookList);

    $('#bookList table tbody').html(tableContent);
    addAvgRatingStar();
}

function clearSearch(){
    $('#findby #inputsearch').val('');
    $('#reviewList table tbody').empty();
    $('#bookInfo').empty();
    populateTable('', '');
}

function showAddBook(){
    $("#addBook").show();
    $("#btnAdd").show();
    $("#addReview").hide();
    $(".linkupdatebook").hide();
    $(".linkaddreview").hide();
    $('#findby').hide();
    $('#btnUpdate').hide();
    $('#addBook input').val('');
};

function findByData(){
    var field = $('#findby #selectedfield').val();
    var srcText = $('#findby #inputsearch').val();
    populateTable(field, srcText);
}

$("#inputbookprice").on("keyup", function(){
    var valid = /^\d{0,12}(\.\d{0,2})?$/.test(this.value),
        val = this.value;
    
    if(!valid){
        this.value = val.substring(0, val.length - 1);
    }
});

$(function () {
    $("#reviewrate").rateYo({
        normalFill: "#A0A0A0",
        fullStar: true,
        rating: 1
  });
});

function addAvgRatingStar()
{
    $.each(bookList, function(){
        $('#'+this._id).rateYo({
            rating: this.average_rate/100,
            readOnly: true
        });
    });
}

function addReviewRatingStar(reviews)
{
    $.each(reviews, function(){
        $('#'+this._id).rateYo({
            rating: this.rate,
            readOnly: true
        });
    });
}



