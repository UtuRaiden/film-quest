var watchListEl = document.querySelector('#watchList')

favList = []

watchListEl.addEventListener('click',function(event){
    var isButton = event.target.nodeName === 'BUTTON';
    var element = event.target;
    if(!isButton)return;
    var favName = element.previousElementSibling.textContent;
    //delete item fom the array
    var favIndex = favList.indexOf(favName);
    favList.splice(favIndex, 1);
    element.parentElement.remove();
    refreshSavedList();
})
//create the watch list cards
function createFavListElement(i){
    var itemEl = document.createElement('div');
    var liEl = document.createElement('li')
    liEl.textContent = favList[i]
    var delEl = document.createElement('button')
    delEl.textContent = 'Delete'
    itemEl.append(liEl,delEl)
    return itemEl
}

function renderFav(){
    for(var i = 0;i < favList.length;i++){
    var favItem = createFavListElement(i)
    watchListEl.appendChild(favItem);
    }
    
}

function refreshSavedList() {
    localStorage.setItem('favList',JSON.stringify(favList))
}

function favInit(){
    var storedFav = JSON.parse(localStorage.getItem('favList'));
    if(storedFav !== null){
        favList = storedFav
    }
    renderFav()
}










favInit()