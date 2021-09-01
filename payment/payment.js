var form = $('form');
var hf, threeDS;
var paymentData;
var $saveBtn = $("#save-btn");
var $orderBtn = $("#order-btn");
var $paymentAccounts = $("#payment-accounts");
$orderBtn.hide()

const deviceToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxdDdveTVKQlB2ZzJ0NXZxbWtaaDkxU0xSRUQifQ.Dtq7ZyYMgROM7MCV45-PjGovWW8Wy6uX8nblpAWOLN0DzLaBXLsJQSBcz73Q-hOw3Vu8zEEZYavRbGnXJeOiXK3gg-8yi9-4n4ZyBbx0pjGekmsViIUeTtlZTe0FvV6tw7ordSJyBz0b27THsrK6akaAC_KxHT51yrNXxu1WY0nYw8lvg66O5TT5qYqzw0o1a7nT9aWT_LMkehF6OISG86hgj_oHOVXUdVVCOAWP03nxqp1luzo7T0TSfifLCvcV_Vp380PehGBw6e9I5Ufla3PYpphDWVyXfPJF7ztyp8oOKzB3XACCLlUYY7uwPWfU9__Dl5yZ7e2O9Bwa7LSuCw'
const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjI0ODI0ODEsImlkIjoiMWJ0UUdGSkNWcUNaaUE3cGs5NVRFZ3NBVUlRIiwic3ViIjo2NjQxMzM0fQ.FL0Qm0hxKqNRydgWRelgpsETJFgyemlKJvZujv-j1RUUlLqQm_uF-HnHEc6UuGhHUK_hiVwb-KTcWKiKx4SbWkOmcuj9GFAijWDgdYNjb_cY9MYIxLEIX7tFACegimO2yxFt-fUp5JRPSHBbu8WjJ4fi9M9ICW1IyqJuAf-oFXM62yTE0NMBLMSyCGwB2bC10QLBcUXDUjVgyM1J8GIpiylC5mOVWGd80HGeej4i278s1EIO4yM79Z6DFVV1Q8YOBjDTbv9Acqsjt_DUuhPlJ3zDYzpHLKzzpzP3ohLleQa8qMSqKl_-lnkj-J9JgIBQSuCRijoQKM69t1t9sNOrNh6KRS3mdsq-TZw6_ef4gwZ7Gioq2bM8NZILXDY4-jLmm2_iNr8usFP5IzldBzzBERV8SNuX94Q-DOC9P7Yctt8VeIBJGlWTYmufsd2y4WiSEk6_yERueHcZTHg6-fuPsBmariLtewKvfQZrjXxrj1OIwQB39YYUgkeYlgLzIBCKjT2eIq3ZuE3fTkqL0dl7xLuFRp95pmtsTya6H-1rZ9Kmf6zHFoH-3CoWKYb6OwOodOS4kAg7LLd2h4Gvvu45TdgLIHIZSI8BBWhYeebiFaCCSVQ-9SVhmR2Y6agl4UM6DtxHmcgWRfQ2xDXN4q_o03-0y0Lkc6YNyd8Q98iACQU'
const addressId = '1tfbNzsAiAhFtJtBqdW1dm0NA2G'

function setupComponents(clientToken) {
    return Promise.all([
        braintree.hostedFields.create({
            authorization: clientToken,
            styles: {
                input: {
                    // change input styles to match
                    // bootstrap styles
                    'font-size': '1rem',
                    color: '#495057'
                }
            },
            fields: {
                cardholderName: {
                    selector: '#cc-name',
                    placeholder: 'Name as it appears on your card'
                },
                number: {
                    selector: '#cc-number',
                    placeholder: '4111 1111 1111 1111'
                },
                cvv: {
                    selector: '#cc-cvv',
                    placeholder: '123'
                },
                expirationDate: {
                    selector: '#cc-expiration',
                    placeholder: 'MM / YY'
                }
            }
        }, function (err, hostedFieldsInstance) {
            if (err) {
                console.error(err);
                return;
            }

            hf = hostedFieldsInstance;

            function setValidityClasses(element, validity) {
                if (validity) {
                    element.removeClass('is-invalid');
                    element.addClass('is-valid');
                } else {
                    element.addClass('is-invalid');
                    element.removeClass('is-valid');
                }
            }

            function validateInput(element) {
                // very basic validation, if the
                // fields are empty, mark them
                // as invalid, if not, mark them
                // as valid

                if (!element.val().trim()) {
                    setValidityClasses(element, false);

                    return false;
                }

                setValidityClasses(element, true);

                return true;
            }

            var ccName = $('#cc-name');

            ccName.on('change', function () {
                validateInput(ccName);
            });

            hostedFieldsInstance.on('validityChange', function (event) {
                var field = event.fields[event.emittedBy];

                // Remove any previously applied error or warning classes
                $(field.container).removeClass('is-valid');
                $(field.container).removeClass('is-invalid');

                if (field.isValid) {
                    $(field.container).addClass('is-valid');
                } else if (field.isPotentiallyValid) {
                    // skip adding classes if the field is
                    // not valid, but is potentially valid
                } else {
                    $(field.container).addClass('is-invalid');
                }
            });

            hostedFieldsInstance.on('cardTypeChange', function (event) {
                var cardBrand = $('#card-brand');
                var cvvLabel = $('[for="cc-cvv"]');

                if (event.cards.length === 1) {
                    var card = event.cards[0];

                    // change pay button to specify the type of card
                    // being used
                    cardBrand.text(card.niceType);
                    // update the security code label
                    cvvLabel.text(card.code.name);
                } else {
                    // reset to defaults
                    cardBrand.text('Card');
                    cvvLabel.text('CVV');
                }
            });
        }),
        braintree.threeDSecure.create({
            authorization: clientToken,
            version: 2
        })
    ]);
}

function start() {
    getClientToken();
}

function onFetchClientToken(clientToken) {
    return setupComponents(clientToken).then(function (instances) {
        threeDS = instances[1];
    }).catch(function (err) {
        console.log('component error:', err);
    });
}

$saveBtn.on("click", function (event) {
    event.preventDefault();

    var formIsInvalid = false;
    var state = hf.getState();

    // Loop through the Hosted Fields and check
    // for validity, apply the is-invalid class
    // to the field container if invalid
    Object.keys(state.fields).forEach(function (field) {
        if (!state.fields[field].isValid) {
            $(state.fields[field].container).addClass('is-invalid');
            formIsInvalid = true;
        }
    });

    if (formIsInvalid) {
        // skip tokenization request if any fields are invalid
        return;
    }

    hf.tokenize().then(function (payload) {
        console.log("tokenization success: ", payload);
        paymentData = payload;

        // submit payment data to payment-service
        selectPaymentNew(paymentData.nonce)
    }).catch(function (err) {
        console.log(err);
    });
});

$paymentAccounts.on("click", function (event) {
    event.preventDefault();

    var paymentAccountId = event.target.dataset.paymentAccountId;
    selectPaymentExisting(paymentAccountId);
});

$orderBtn.on("click", function (event) {
    event.preventDefault();

    threeDS.verifyCard({
        onLookupComplete: function (data, next) {
            next();
        },
        amount: '100.00',
        nonce: paymentData.nonce,
        bin: paymentData.details.bin,
    }).then(function (payload) {
        if (!payload.liabilityShifted) {
            console.log('Liability did not shift', payload);
            return;
        }

        console.log('verification success:', payload);
        // send nonce and verification data to your server
        executeTransaction(payload.nonce)
    }).catch(function (err) {
        console.log(err);
    });
});

function getClientToken() {
    $.get({
        url: "http://localhost:8091/payment-page",
        headers: {
            'accept': 'application/json',
            'x-device-token': deviceToken,
            'x-access-token': accessToken,
            'x-locale': 'de-DE',
            'Content-Type': 'application/json'
        },
        dataType: "json",
        success: function (res) {
            var po = (res.paymentOptions.filter(v => v.paymentMethod === 'braintree_credit_card'))[0];
            var token = po.providerAuthentication.token
            console.log("braintree client token: ", token);
            onFetchClientToken(token);
            onFetchPaymentAccounts(po.paymentAccounts);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function onFetchPaymentAccounts(paymentAccounts) {
    var accounts = {}
    for (let i = 0; paymentAccounts != null && i < paymentAccounts.length; i++) {
        console.log(paymentAccounts[i]);
        var number = i + 1;
        accounts[number] = $('<div class=\'payment-account-box col-md-6 col-sm-12\' data-payment-account-id=' + paymentAccounts[i].paymentAccountId + '>' + JSON.stringify(paymentAccounts[i].paymentData) + '</div>')
        $paymentAccounts.append(accounts[number]);
    }
}

function selectPaymentNew(nonce) {
    $.post({
        url: "http://localhost:8091/current-payment/new",
        headers: {
            'x-device-token': deviceToken,
            'x-access-token': accessToken,
            'x-locale': 'de-DE',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "addressId": addressId,
            "paymentMethod": "braintree_credit_card",
            "paymentData": {
                "braintree_payment_method_token": nonce,
            },
            "createAccount": true,
            "setAsDefault": true
        }),
        dataType: "json",
        success: function (data) {
            console.log("saved data in current-payment", data);
            $orderBtn.show();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function selectPaymentExisting(paymentAccountId) {
    $.post({
        url: "http://localhost:8091/existing",
        headers: {
            'x-device-token': deviceToken,
            'x-access-token': accessToken,
            'x-locale': 'de-DE',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "addressId": addressId,
            "paymentAccountId": paymentAccountId,
            "setAsDefault": true
        }),
        dataType: "json",
        success: function (data) {
            console.log("saved data in current-payment", data);
            paymentData = {
                nonce: data.paymentData["braintree_payment_method_id"],
                details: {
                    bin: data.paymentData["bin"],
                }
            };
            $orderBtn.show();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function executeTransaction(nonce) {
    $.post({
        url: "http://localhost:8091/execute-transaction",
        headers: {
            'x-device-token': deviceToken,
            'x-access-token': accessToken,
            'x-locale': 'de-DE',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "braintree_payment_method_id": nonce,
            "braintree_device_data_string": "sdfhkjsakldfhs"
        }),
        dataType: "text",
        success: function () {
            console.log("sent the execute-transaction request to FDS")
            console.log("SUCCESS!")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

start();