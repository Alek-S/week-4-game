//characters:
// Luke Skywalker
// Obi-Wan Kenobi
// Darth Maul
// Darth Sidious


//wait for website to load
$( document ).ready(function(){

	var game = {
		characterList: ['skywalker', 'kenobi', 'maul', 'sidious'],
		selected: false,
		opponent: false,
		reset: function(){ //reset game by reloading the page
			$('body').fadeOut('slow');
			window.location.reload();
		}
	}

	function Character(first, last){ //Constructor function

		//Properties
		this.firstName = first;
		this.lastName = last;
		this.isSelected = false; //is this the character the player is playing as
		this.isOpponent = false; //is this character an opponent
		this.isAlive = true; //is this character alive - for selected or opponent
		this.health = 0;
		this.attack = 0;
		this.increaseAttackBy = 0;
		this.counterAttack = 0;

		//HTML
		this.imagePath = 'assets/images/' + last.toLowerCase() +'.jpg';
		this.$id = $('#' + last.toLowerCase() );
		this.$name = $('#' + last.toLowerCase() + ' .name');
		this.$health = $( '#' + last.toLowerCase() + ' .health');

		//Methods
		this.kill = function(){ // this character has been defeated
			this.isAlive = false
		};
		
		this.initialize = function(){ // generate this characters health and attach strength
			this.health = Math.floor(Math.random() * (150 - 100) + 100); //between 100 and 150
			this.attack = Math.floor(Math.random() * (10 - 5) + 5);
			this.increaseAttackBy = this.attack;
			this.counterAttack = Math.floor(Math.random() * (25 - 5) + 5);
			this.refresh();
		};

		this.refresh = function(){ //refresh this characters displayed health
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


	// ==== MAIN LISTEN EVENTS ====

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

				console.log( 'Opponent Selected:' , $(this).attr('id'));
				$(this).addClass('fighting'); //for CSS purposes
				game.opponent = true;

				//move opponent to battle area
				$('.displayOpponent').html( this );
			}
		});
	}


	$('#attack').on( 'click', function(){

		if(game.opponent && $('#attack').attr('class') === 'active'){
			var player = $('.selected').attr('id');
			var opponent = $('.fighting').attr('id');

			//cache
			var $playerResult = $('#playerResult');
			var $opponentResult = $('#opponentResult');
			var $result = $('#result');
			var $fightOver = $('#fightOver');
			var $reset = $('#reset');

			//each takes damage
			console.log(player, 'attacks with:', lookup(player).attack );
			console.log(opponent, 'counters with:', lookup(opponent).counterAttack);

			lookup(player).health = lookup(player).health - lookup(opponent).counterAttack;
			lookup(player).refresh();

			lookup(opponent).health = lookup(opponent).health - lookup(player).attack;
			lookup(opponent).refresh();

			//player gains attack strength
			lookup(player).attack += lookup(player).increaseAttackBy;


			//show results of fight
			$playerResult.text( lookup(player).firstName + " " + lookup(player).lastName 
				+ ' attacks with: ' + lookup(player).attack );
			$opponentResult.text( lookup(opponent).firstName + " " + lookup(opponent).lastName 
				+ ' counters with: ' + lookup(opponent).counterAttack );
			$result.fadeIn('fast');

			//if player lost
			if(lookup(player).health <= 0 ){
				//kill()!!!
				lookup(player).kill();

				//player lost in result section
				$fightOver.text( lookup(player).firstName + " " + lookup(player).lastName 
					+ ' has been Defeated! All is Lost' );
				$fightOver.addClass('lost'); //for CSS Red

				//show reset button
				$reset.fadeIn('fast');
				waitForReset();
			}

			//if opponent lost
				// kill()!!!
				//clear current opponent

		}else{
			console.log('nope!');
		}
	});


	// ==== ADDITIONAL HELPER FUNCTIONS ====


	//because the internets told me eval() was evil
	function lookup(name){
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
				console.log('Error', name, 'passed to lookup(), but not valid.');
			break;
		}
	}

	function waitForReset(){
		$('#attack').removeClass('active'); //can't keep attacking

		$('#reset').on('click', function(){
			game.reset();
		});
	}

	function sanityCheck(parameter){ //see value of all players for given parameter -- for debugging
		console.log("\nskywalker." + parameter + ": " + skywalker[parameter]);
		console.log("kenobi." + parameter + ": " + kenobi[parameter]);
		console.log("maul." + parameter + ": " + maul[parameter]);
		console.log("sidious." + parameter + ": " + sidious[parameter]);
	}


}); //end .ready()