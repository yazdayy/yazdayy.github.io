%% TODO:
%% Remove veggies/sauce that have already been chosen

% Triggers interaction
% Prolog base - Subway employee
% User - Customer
order(0):-
    writeln("Welcome to Subway! Please choose your meal: "),
    findall(X, meals(X), Options),
    validate_and_query_options(meal,Options).

order(Y):-
	generate_options(X,Y,L), validate_and_query_options(X, L).

% Generate questions/options for customer based on previous step/selection
% For example, if customer had completed the bread step and now must select his/her of meat of choice
% then, the KBS checks for the previous selected_meal(Y) in ask_meat(L) predicate.
% If vegan_meal(Y) or veggie_meal(Y) is true, L is empty and selection of meat step is skipped directly to veggie step
generate_options(X,Y,L):-
	Y==meal -> (writeln("Please choose the size of your bread: "), ask_size(L), X=size);
    Y==size -> (writeln("Please choose your bread: "), ask_bread(L), X=bread);
    Y==bread -> (writeln("Please choose your meat: "), ask_meat(L), (is_empty(L) -> (writeln("Meat options not applicable"), order(meat));
                                                                   X=meat));
    Y==meat -> (writeln("Please choose your veggies: "), ask_veggies(L), X=veggies);
    Y==veggies -> (writeln("Please choose your sauce: "), ask_sauces(L), X=sauce);
    Y==sauce -> (writeln("Please choose your top-up: "), ask_topups(L),(is_empty(L) -> (writeln("Top-up options not applicable"), order(topups));
                                                                      X=topups));
    Y==topups -> (writeln("Please choose your sides: "), ask_sides(L), X=sides);
    Y==cookies ->(writeln("Please choose your cookie: "), ask_cookies(L), X=cookies);
    Y==chips -> (writeln("Please choose your chips: "), ask_chips(L), X=chips);
    Y==sides -> (writeln("Please choose your drink: "), ask_drink(L), X=drink);
    Y==drink -> (writeln('Order complete! Order List: '), get_order(OrderList), write(OrderList),
                 writeln(' Thank you!'), abort).

% assert(selected_?(Selection)) tells the KBS what the customer has selected so far for his/her order
% ? refers to the step (e.g. meal, size, bread, etc) the customer is at
validate_and_query_options(X,L):-
    write(L),
    read(Selection),
    (Selection==q -> abort;
     (X==meal -> assert(selected_meal(Selection));
     X==size -> assert(selected_size(Selection));
     X==bread -> assert(selected_bread(Selection));
     X==meat -> assert(selected_meat(Selection));
     X==veggies -> (assert(selected_veggies(Selection)), assert(order_list(Selection)), print('Would you like to add more veggies? y|n'), read(Choice), (Choice==y -> order(meat); order(X)));
     X==sauce -> (assert(selected_sauce(Selection)), assert(order_list(Selection)), print("Would you like to add more sauce? y|n"), read(Choice), (Choice==y -> order(veggies); order(X)));
     X==topups -> assert(selected_topups(Selection));
     X==sides -> (assert(selected_sides(Selection)), assert(order_list(Selection)),(Selection==cookies -> order(cookies);
                                                    Selection==chips -> order(chips);
                                                    order(sides)));
     X==cookies -> (assert(selected_cookie(Selection)), assert(order_list(Selection)),order(sides));
     X==chips -> (assert(selected_chips(Selection)), assert(order_list(Selection)),order(sides));
     X==drink -> assert(selected_drink(Selection))),
     assert(order_list(Selection));
     X==end -> abort),
    order(X).

%% FACTS

% Facts to check conditions
healthy_meal(healthy).
value_meal(value).
vegan_meal(vegan).
veggie_meal(veggie).

% Possible choice of options for each category
meals([healthy, normal, value, vegan, veggie]).
sandwich_size([six_inch, footlong]).
breads([wheat, honey_oat, italian, hearty_italian, flatbread]).
meats([chicken, beef, ham, bacon, salmon, tuna, turkey]).
veggies([cucumber, green_peppers, lettuce, red_onions, tomatoes]).
veggie(cucumbers).
veggie(lettuce).
veggie(tomatoes).

unhealthy_sauces([chipotle, bbq, ranch, sweet_chilli, mayo]).
healthy_sauces([honey_mustard, sweet_onion]).

non_vegan_topups([american, monterey_jack, cheddar]).
vegan_topups([avocado, mushrooms, caramelised_onions]).

unhealthy_sides([chips, cookies, hashbrowns]).
healthy_sides([apple_slices]).
cookies([choc_chip, double_choc, oatmeal_raisin]).
chips([original, sour_cream, bbq]).

healthy_drinks([water]).
unhealthy_drinks([coke, sprite, fanta]).

%% RULES

% Rule to check whether a list is empty
is_empty(List):- not(member(_,List)).

% Rule for appending elements to list
append_options([], Y, Y).
append_options([H|X], Y, [H|Z]) :-
    append_options(X, Y, Z).

% Return a list of possible meals
ask_meal(X) :-
    meals(X).

% Return a list of possible sandwich sizes
ask_size(X) :-
    sandwich_size(X).

% Return a list of possible breads
ask_bread(X) :-
    breads(X).

% Return a list of possible meats
% List of options based on previous selected_meal(Y) information given
% Vegan and Veggie meals do not have meat options, return empty list []
% If vegan_meal(Y) or veggie_meal(Y) is true, return empty list []
% Otherwise, return a list of possible meats
% Using built-in method findall(X, pred(X), List) - Find possible values for predicate and add to the List
ask_meat(X) :-
    findall(X,
            (selected_meal(Y),
             \+ vegan_meal(Y),
             \+ veggie_meal(Y),
             meats(X)),
            X).

% Return a list of possible veggies
ask_veggie(X) :-
    findall(X,
            (selected_veggies(Y),
             veggie(X),
             Y \= X),
            X).
ask_veggies(X) :-
    veggies(X).

% Return a list of possible sauces
% List of options based on previous selected_meal(Y) information given
% Healthy meals do not have unhealthy sauces
% If healthy_meal(Y) is true, return a list containing only healthy_sauces
% Otherwise, append both the list of healthy_sauces and unhealthy_sauces to a single list and return it
% Using built-in method findall(X, pred(X), List) - Find possible values for predicate and add to the List
ask_sauces(X) :-
    findall(X,
            (selected_meal(Y),
             healthy_meal(Y) -> healthy_sauces(X);
             unhealthy_sauces(L1),
             healthy_sauces(L2),
             append_options(L1, L2, X)
            ),
            X).

% Return a list of possible top-ups
% List of options based on previous selected_meal(Y) information given
% Value meal does not have top-ups
% Vegan meal does not have non-vegan top-ups
% If value_meal(Y) is true, return an empty list []
% If vegan_meal is true, return a list containing only vegan_topups
% Otherwise, append both the list of vegan_topups and non_vegan_topups to a single list and return it
% Using built-in method findall(X, pred(X), List) - Find possible values for predicate and add to the List
ask_topups(X) :-
    findall(X,
            (selected_meal(Y),
             \+ value_meal(Y) -> (vegan_meal(Y) ->  vegan_topups(X);
                                  non_vegan_topups(L1),
                                  vegan_topups(L2),
                                  append_options(L1, L2, X))
            ),
            X).

% Return a list of possible sides
% List of options based on previous selected_meal(Y) information given
% Healthy meals do not have unhealthy sides
% If healthy_meal(Y) is true, return a list containing only healthy_sides
% Otherwise, append both the list of healthy_sides and unhealthy_sides to a single list and return it
% Using built-in method findall(X, pred(X), List) - Find possible values for predicate and add to the List
ask_sides(X) :-
    findall(X,
    (selected_meal(Y),
     healthy_meal(Y) -> healthy_sides(X);
     unhealthy_sides(L1),
     healthy_sides(L2),
     append_options(L1, L2, X)
    ),
    X).

% Return a list of possible cookies
% Only triggered when customer selects cookie for side
ask_cookies(X) :-
    cookies(X).

% Return a list of possible chips
% Only triggered when customer selects chips for side
ask_chips(X) :-
    chips(X).

% Return a list of possible drinks
% List of options based on previous selected_meal(Y) information given
% Healthy meals do not have unhealthy drinks
% If healthy_meal(Y) is true, return a list containing only healthy_drinks
% Otherwise, append both the list of healthy_drinks and unhealthy_drinks to a single list and return it
% Using built-in method findall(X, pred(X), List) - Find possible values for predicate and add to the List
ask_drink(X) :-
    findall(X,
            (selected_meal(Y),
             healthy_meal(Y) -> healthy_drinks(X);
             unhealthy_drinks(L1),
             healthy_drinks(L2),
             append_options(L1, L2, X)
            ),
            X).

% Return order list
get_order(X) :-
    findall(X, order_list(X), X).

show_size(Size) :-
    findall(X, selected_size(X), Size).
show_meals(Meals) :-
    findall(X, selected_meal(X), Meals).
show_breads(Breads) :-
    findall(X, selected_bread(X), Breads).
show_meats(Meats) :-
    findall(X, selected_meat(X), Meats).
show_veggies(Veggies) :-
    findall(X, selected_veggies(X), Veggies).
show_sauces(Sauces) :-
    findall(X, selected_sauce(X), Sauces).
show_topups(TopUps) :-
    findall(X, selected_topups(X), TopUps).
show_sides(Sides) :-
    findall(X, selected_sides(X), Sides).
