/**
 * Created by braddavis on 2/21/15.
 */
htsApp.factory('mailboxFactory', ['$http', '$rootScope', 'ENV', 'sideNavFactory', function ($http, $rootScope, ENV, sideNavFactory) {

    var factory = {};



    factory.mail = {
        offers: {
            sent: {
                data: []
            },
            received: {
                data: []
            }
        },
        questions: {
            sent: {
                data: []
            },
            received: {
                data: []
            }
        },
        answers: {
            sent: {
                data: []
            },
            received: {
                data: []
            }
        },
        messages: {
            sent: {
                data: []
            },
            received : {
                data: []
            }
        },
        totalUnread : function () {

            //count all the unread offers in the inbox
            if(this.offers.received.data.length){ //If there is an offer on an item

                var offers = this.offers.received.data;

                for(var g=0; g < offers.length; g++) { //Loop though all the offers

                    var offer= offers[g];

                    offer.read = false;

                    for(var h=0; h < offer.proposedTimes.length; h++) { //loop though all the proposed times

                        var proposedTime = offer.proposedTimes[h];

                        if(proposedTime.acceptedAt){ //if the proposed time has been accepted
                            offer.read = true;
                            break;
                        }
                    }
                }

                var unreadOffersCount = 0;
                for(var i=0; i < offers.length; i++) { //Loop though all the offers and count the unread items.

                    var checkOfferCount = offers[i];

                    if(!checkOfferCount.read){
                        unreadOffersCount++;
                    }
                }

                this.offers.received.count = unreadOffersCount;

            } else {
                this.offers.received.count = this.offers.received.data.length;
            }

            //count all the sent offers
            this.offers.sent.count = this.offers.sent.data.length;

            //Count all the unread questions in inbox
            if(this.questions.received.data.length){
                var unreadQuestionsCount = 0;
                for(var i=0; i < this.questions.received.data.length; i++){
                    if(!this.questions.received.data[i].answers.length){
                        unreadQuestionsCount++;
                    }
                }

                this.questions.received.count = unreadQuestionsCount;

            } else {
                this.questions.received.count = this.questions.received.data.length;
            }


            //count all sent questions
            this.questions.sent.count = this.questions.sent.data.length;

            this.answers.received.count = this.answers.received.data.length;
            this.answers.sent.count = this.answers.sent.data.length;

            this.messages.received.count = this.messages.received.data.length;
            this.messages.sent.count = this.messages.sent.data.length;

            var totalUnreadCountReceived = this.offers.received.count + this.questions.received.count + this.answers.received.count + this.messages.received.count;

            sideNavFactory.items[2].alerts = totalUnreadCountReceived;
            return totalUnreadCountReceived;
        },
        quickCache : {} //Used to store the offer or question object as we move in-between states
    };


    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        if (toState.name === 'mailbox.inbox.offers') {
            factory.cabinet[0].folders[0].active = true;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = false;
        } else if (toState.name === 'mailbox.inbox.questions') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = true;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = false;
        } else if (toState.name === 'mailbox.inbox.questions.question') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = true;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = false;
        } else if (toState.name === 'mailbox.outbox.offers') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = true;
            factory.cabinet[1].folders[1].active = false;
        } else if (toState.name === 'mailbox.outbox.offers.offer') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = true;
            factory.cabinet[1].folders[1].active = false;
        } else if (toState.name === 'mailbox.outbox.questions') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = true;
        } else if (toState.name === 'mailbox.outbox.questions.question') {
            factory.cabinet[0].folders[0].active = false;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = true;
        } else if (toState.name === 'mailbox.inbox.offers.offer') {
            factory.cabinet[0].folders[0].active = true;
            factory.cabinet[0].folders[1].active = false;
            factory.cabinet[1].folders[0].active = false;
            factory.cabinet[1].folders[1].active = false;
        }
    });


    factory.cabinet = [
        {
            title: 'Inbox',
            link: 'mailbox.inbox',
            folders: [
                {
                    title: 'Offers',
                    link: 'mailbox.inbox.offers',
                    active: false,
                    content: factory.mail.offers.received
                },
                {
                    title: 'Questions',
                    link: 'mailbox.inbox.questions',
                    active: false,
                    content: factory.mail.questions.received
                }
            ]
        },
        {
            title: 'Sent',
            folders: [
                {
                    title: 'Offers',
                    link: 'mailbox.outbox.offers',
                    active: false

                },
                {
                    title: 'Questions',
                    link: 'mailbox.outbox.questions',
                    active: false
                }
            ]
        }
    ];


    return factory;

}]);