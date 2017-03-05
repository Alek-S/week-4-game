$( document ).ready(function(){ //wait for website to load

	//cache
	var $playerResult = $('#playerResult');
	var $opponentResult = $('#opponentResult');
	var $result = $('#result');
	var $fightOver = $('#fightOver');
	var $resetButton = $('#reset');

	var game = {
		characterList: [], //character added when charcter is initalized
		defeatedList: [],
		selected: false,
		opponent: false,
		reset: function(){ //reset game by reloading the page
			window.location.reload();
		}
	}

	function Character(first, last){ //Constructor function
		//Properties
		this.firstName = first;
		this.lastName = last;
		this.isSelected = false; //is this the character the player is playing as
		this.isOpponent = false; //is this character an opponent
		this.health = 0;
		this.attack = 0;
		this.increaseAttackBy = 0;
		this.counterAttack = 0;

		//HTML
		this.imagePath = 'assets/images/' + last.toLowerCase() +'.jpg';
		this.$id = $('#' + last.toLowerCase() );
		this.$name = $('#' + last.toLowerCase() + ' .name');
		this.$health = $( '#' + last.toLowerCase() + ' .health');
		this.$img = $( '#' + last.toLowerCase() + ' img');

		//Methods
		this.initialize = function(){ // initialize character
			this.$img.attr('src', this.imagePath); //populate image
			this.health = Math.floor(Math.random() * (150 - 100) + 100); //between 100 and 150
			this.attack = Math.floor(Math.random() * (10 - 5) + 5);
			this.increaseAttackBy = this.attack; //attack strength increases after each round
			this.counterAttack = Math.floor(Math.random() * (20 - 5) + 5);
			this.refresh();
			game.characterList.push( last.toLowerCase() ); // add this character to game character list
		};

		this.refresh = function(){ //refresh this character's displayed health
			this.$health.text( this.health );
		};
	}

	//Individual characters inhereted from Character() 
	var skywalker = new Character('Luke','Skywalker');
	var kenobi = new Character('Obi-Wan', 'Kenobi');
	var maul = new Character('Darth', 'Maul');
	var sidious = new Character('Darth', 'Sidious');

	//intialize character properties
	skywalker.initialize();
	kenobi.initialize();	
	maul.initialize();
	sidious.initialize();


	// ==== MAIN EVENTS ====
	//Select Player
	$('#select .characterCard').on('click',function(){
		if(!game.selected){
			game.selected = true;

			var $name = $(this).attr('id'); //name of character selected
			$(this).addClass('selected'); //for CSS purposes

			console.log("Player's Character:", $name);

			//Set player's charcter isSelected true
			switch($name){
				case 'skywalker':
					skywalker.isSelected = true;
					break;
				case 'kenobi':
					kenobi.isSelected = true;
					break;
				case 'maul':
					maul.isSelected = true;
					break;
				case 'sidious':
					sidious.isSelected = true;
					break;
			}

			//if not name set to opponents true
			for (var i = 0; i < game.characterList.length; i++) {
				if(game.characterList[i] !== $name){
					lookup(game.characterList[i]).isOpponent = true; //isOpponent true
					$("#" + game.characterList[i] ).addClass('opponent')
				};
			}

			//hide select character section, and show other other sections
			$('#select').slideUp();
			$('#opponentCharacters').delay(350).slideDown();
			$('#battleArea').delay(650).slideDown();


			//move selected to Your Character
			$('#selectedCharacter .displaySelected').html( this );

			//move opponents to Characters left to attack
			$('#opponentCharacters').append( $('.opponent') );

			pickOpponent(); //move on to picking opponent phase

		}
	});


	function pickOpponent(){//Select Opponent
		$('.opponent').on('click', function(){
			if( !game.opponent ){ //if there isn't already a opponent
				//clear results from previous round
				resetResults();

				console.log( 'Opponent Selected:' , $(this).attr('id'));
				$(this).addClass('fighting'); //for CSS purposes
				game.opponent = true;

				//move opponent to battle area
				$('.displayOpponent').html( this );
			}
		});
	}

	//ATTACK BUTTON
	$('#attack').on( 'click', function(){
		//if opponent selected and in active attack mode
		if(game.opponent && $('#attack').attr('class') === 'active'){
			var player = $('.selected').attr('id');
			var opponent = $('.fighting').attr('id');

			//each takes damage
			lookup(player).health = lookup(player).health - lookup(opponent).counterAttack;
			lookup(player).refresh();

			lookup(opponent).health = lookup(opponent).health - lookup(player).attack;
			lookup(opponent).refresh();

			//show results of fight
			$playerResult.text( lookup(player).firstName + " " + lookup(player).lastName 
				+ ' attacks with: ' + lookup(player).attack );
			$opponentResult.text( lookup(opponent).firstName + " " + lookup(opponent).lastName 
				+ ' counters with: ' + lookup(opponent).counterAttack );
			$result.fadeIn('fast');

			//player gains attack strength
			lookup(player).attack += lookup(player).increaseAttackBy;

			//if player lost
			if(lookup(player).health <= 0 ){
				
				//player lost in result section
				$fightOver.text( lookup(player).firstName + " " + lookup(player).lastName 
					+ ' has been defeated! All is lost.' );
				$fightOver.addClass('lost'); //for CSS Red

				//show reset button
				$resetButton.fadeIn('fast');
				waitForReset();
			} else if (lookup(opponent).health <= 0 && lookup(player).health >= 1){ //if opponent lost
				game.defeatedList.push( lookup(opponent).lastName );
				console.log(game.defeatedList);

				//if opponents left to fight
				if(game.defeatedList.length < (game.characterList.length - 1 ) ){
					//show player won result
					$fightOver.text( lookup(opponent).firstName + " " + lookup(opponent).lastName 
						+ ' has been defeated! On to the next one. . .' );
					$fightOver.addClass('won'); //for CSS Red

					//clear current opponent
					$('.displayOpponent').empty();
					game.opponent = false;
				} else {
				//all opponents defeated, player won the game
					//game over message
					$fightOver.text('Well done ' + lookup(player).firstName + ' ' + lookup(player).lastName 
						+ '. You are victorious!')
					$fightOver.addClass('won');

					$resetButton.fadeIn('fast');
					waitForReset();
				}
			}
		}
	});


	// ==== ADDITIONAL HELPER FUNCTIONS ====

	function lookup(name){ //because the internets told me eval() was evil
		switch(name){
			case 'skywalker':
				return skywalker;
				break;
			case 'kenobi':
				return kenobi;
				break;
			case 'maul':
				return maul;
				break;
			case 'sidious':
				return sidious;
				break;
			default:
				console.log('Error:', name, 'passed to lookup() is not valid option.');
			break;
		}
	}

	function waitForReset(){ //Wait for player to hit reset button, can't keep attacking
		$('#attack').removeClass('active'); 

		$('#reset').on('click', function(){
			game.reset();
		});
	}

	function resetResults(){ //reset result section in between opponents
		$result.hide();
		$playerResult.empty();
		$opponentResult.empty();
		$resetButton.hide();
		$fightOver.empty();
		$fightOver.removeClass('won'); 
		$fightOver.removeClass('lost'); 
	}

	function sanityCheck(parameter){ //see value of all players for given parameter -- for debugging
		console.log("\nskywalker." + parameter + ": " + skywalker[parameter]);
		console.log("kenobi." + parameter + ": " + kenobi[parameter]);
		console.log("maul." + parameter + ": " + maul[parameter]);
		console.log("sidious." + parameter + ": " + sidious[parameter]);
	}

}); //end .ready()