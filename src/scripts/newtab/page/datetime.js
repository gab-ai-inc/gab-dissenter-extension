var DateTime = function() {

    var scope = this;

    //

    var UPDATE_DATE_INTERVAL = 60000; //1m
    var UPDATE_TIME_INTERVAL = 5000; //5s

    //

    var headerTimeBlock = document.getElementById("header-time-block");
    var headerTime = document.getElementById("header-time");
    var headerTimePeriod = document.getElementById("header-time-period");
    var headerDate = document.getElementById("header-date");

    var dateUpdater;
    var timeUpdater;

    //

    function getTimeData() {
        var date = new Date();

        var hour = date.getHours();
        var ampm = hour >= 12 ? 'PM' : 'AM';

        var time = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: "numeric",
            minute: "numeric"
        });

        //Remove AM, PM
        time = time.replace(" AM", "").replace(" PM", "");

        return {
            time: time,
            period: ampm
        };
    };

    function getDateData() {
        var date = new Date();

        var formatted = date.toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return formatted;
    };

    function timeUpdaterFuntion() {
        var timeData = getTimeData();

        headerTime.textContent = timeData.time;
        headerTimePeriod.textContent = timeData.period;
    };

    function dateUpdaterFuntion() {
        var formattedDate = getDateData();

        headerDate.textContent = formattedDate;
    };

    //

    scope.setDateEnabled = function(event) {
        if (!isObject(event)) return false;

        var enabled = event.detail;

        headerDate.classList.toggle("hidden", !enabled);

        if (!enabled) {
            if (dateUpdater) clearInterval(dateUpdater);
        }
        else {
            dateUpdaterFuntion();
            setInterval(dateUpdaterFuntion, UPDATE_DATE_INTERVAL);
        }
    };

    scope.setTimeEnabled = function(event) {
        if (!isObject(event)) return false;
        
        var enabled = event.detail;

        headerTimeBlock.classList.toggle("hidden", !enabled);

        if (!enabled) {
            if (timeUpdater) clearInterval(timeUpdater);
        }
        else {
            timeUpdaterFuntion();
            setInterval(timeUpdaterFuntion, UPDATE_TIME_INTERVAL);
        }
    };

    //

    window.addEventListener("WELM_nt_datetime_show_date", scope.setDateEnabled, false);
    window.addEventListener("WELM_nt_datetime_show_time", scope.setTimeEnabled, false);
};
