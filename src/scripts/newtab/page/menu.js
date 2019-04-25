var Menu = function() {
    
    var menuBtn = document.getElementById('menu-btn');
    var main = document.getElementById('main');

    //

    menuBtn.addEventListener('click', function() {
        main.classList.toggle('sidebar-open');
    });
};
