$(function() {
    // set avios multiplier
    const aviosMultiplier = 1.6;

    // set amex multiplier (currently same as avios but can be changed here)
    const amexMultiplier = 1.6;

    // set nectar breakpoint. always been 500 but make it a variable for ease of update if it changes
    const nectarBreakpoint = 500;

    // set denomination per breakpoint. default example is 500 points = 2.50 cash
    const nectarDenomination = 2.5;

    // set maximium monthly avios to nectar conversion limit
    const conversionLimit = 50000;

    function aviosToNectar(avios) {
        return avios * aviosMultiplier;
    }

    function amexToNectar(amex) {
        return amex * amexMultiplier;
    }

    function nectarToCash(nectarPoints) {
        // so, each 500 points is £2.50
        let rawNectarMultiplier = nectarPoints / nectarBreakpoint;

        // round it down to nearest whole voucher
        let nectarMultiplier = Math.floor(rawNectarMultiplier);

        let remainder = rawNectarMultiplier - nectarMultiplier;

        console.log("value is ", nectarMultiplier, "2.50 vouchers");
        console.log("remaining points", Math.round(remainder*nectarBreakpoint));

        return nectarMultiplier * nectarDenomination;
    }

    function checkConversionLimit(points) {
        let numberOfMonths = points / conversionLimit;
        if (points > conversionLimit) {
            console.log(points, "/", conversionLimit, "=", numberOfMonths);
            $('#alert').html('<strong>Warning!</strong> You have specified more points to convert than is permitted by the Nectar scheme.<br>' +
                'The monthly limit is ' + conversionLimit.toLocaleString('gb') + ' Avios.<br>' +
                'It will take ' + Math.ceil(numberOfMonths) + ' months to convert all your Avios / MR to Nectar points')
                .removeClass('d-none');
        }
    }



    // monitor points boxes for changes
    $('#convert').on('click', function() {
        // init vars
        let nectarPoints, aviosPoints, amexPoints, totalPoints, pointsToConvert;

        totalPoints = pointsToConvert = 0;

        nectarPoints = parseFloat($('#nectarPoints').val());
        aviosPoints = parseFloat($('#aviosPoints').val());
        amexPoints = parseFloat($('#amexPoints').val());

        if (!isNaN(nectarPoints)) {
            console.log("Adding ", nectarPoints, "to total...");
            totalPoints += nectarPoints;
        }

        if (!isNaN(aviosPoints)) {
            console.log("Adding ", aviosPoints, " Avios to total, which is ", aviosToNectar(aviosPoints), " nectar points...");
            pointsToConvert += aviosPoints;
            totalPoints += aviosToNectar(aviosPoints);
        }

        if (!isNaN(amexPoints)) {
            console.log("Adding ", amexPoints, "Amex MR to total, which is ", amexToNectar(amexPoints), " nectar points...");

            pointsToConvert += amexPoints;
            totalPoints += amexToNectar(amexPoints);
        }

        console.log("total nectar points", totalPoints);
        let money = nectarToCash(totalPoints);
        let friendlyMoney = money.toLocaleString('gb', {minimumFractionDigits: 2, maximumFractionDigits: 2})

        $('#result').html(friendlyMoney);

        // check if the Avios to convert is above the monthly limit
        if (pointsToConvert > 0) {
            checkConversionLimit(pointsToConvert);
        }
    });
});