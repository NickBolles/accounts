Issues

1. I tried to make these in a way that were extensible, but extending them is basically impossible right now.
   a. Why? if you extend the user type the user, service and session types will all have the "wrong inverse type"
   `ValidationError: User.allEmails has wrong 'mappedBy' reference type: AccountsMongoUser instead of User`
   b. accounts trys to sanitize the object, but it breaks the private inherited properties, such as \_em, which is the entity manager that mikro orm relies on
   c. mikro orm has trouble finding the correct metadata when the entites are in node_modules
