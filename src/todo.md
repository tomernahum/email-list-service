-   Prettier sign up form styling + "already exists" return option
    - + maybe a honeypot field

-   sign up for an email service, integrate sending welcome emails

-   email db integration


DB table ideas:
- user: 
    email, 
    account history[]json (ie subscribed up, resubscribe-attempt, unsubscribed, resubscribed), 
    history[] of received emails (hashes) or make it a separate table?
    tags[]
    campaigns signed up for[]


email that was sent out: including list of recipients. many:many emails to userids. so we could have a bridging table 

What emails has a given user got?
What users have received a given email?