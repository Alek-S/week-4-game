//characters:
// Luke Skywalker
// Obi-Wan Kenobi
// Darth Maul
// Darth Sidious


//wait for website to load
$( document ).ready(function(){

	var characterList = ['skywalker', 'kenobi', 'maul', 'sidious'];
	var selected = false;

	// ==== DECLARATIONS ====
	function Character(first, last){
	//Constructor function to use for creating individual character objects

		//Properties
		this.firstName = first;
		this.lastName = last;
		this.isSelected = false; //is this the character the player is playing as
		this.isOpponent = false; //is this character an opponent
		this.isAlive = true; //is this character alive - for selected or opponent
		this.health = 0;
		this.attack = 0;
		this.counterAttack = 0;

		//HTML
		this.imagePath = 'assets/images/' + last.toLowerCase() +'.jpg';
		this.$id = $('#' + last.toLowerCase() );
		this.$name = $('#' + last.toLowerCase() + ' .name');
		this.$health = $( '#' + last.toLowerCase() + ' .health');

		//Methods
		this.select = function(){ // this character is the one the player selected
			this.isSelected = true;
		};

		this.kill = function(){ // this character has been defeated
			this.isAlive = false
		};

		this.reset = function(){ // reset this characted back to the initial values
			this.isSelected = false;
			this.isOpponent = false;
			this.isAlive = true;
			this.initialize();
		};
		
		this.initialize = function(){ // generate this characters health and attach strength
			this.health = Math.floor(Math.random() * (150 - 100) + 100); //between 100 and 150
			this.attack = Math.floor(Math.random() * (25 - 5) + 5);
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
	$('#select a').on('click',function(){
		if(!selected){
			selected = true;

			var $name = $(this).attr('id'); //name of character selected
			console.log("Selected:", $name);

			//if name set selected true
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
			for (var i = 0; i < characterList.length; i++) {
				if(characterList[i] !== $name){
					lookup(characterList[i]).isOpponent = true;
				};
			}
			
			//hide select character
			$('#select').slideUp();

			//move selected to Your Character
			$('#selectedCharacter .characterCard').html( this );

			//move opponents to Characters left to attack
			$('#opponentCharacters').append( $('#select .characterCard') );
		}
	});

	//Select Opponent
		//if opponent section is empty
			//remove character card from left to attack

	//Attack Button
		//if current opponent not empty
			//fight it out
			//show results of fight
			//check if someone lost yet

			//if opponent lost
				// kill()!!!
				//clear current opponent

			//if player lost
				//kill()!!!
				//player lost in result section
				//show reset button


	// ==== ADDITIONAL GAME FUNCTIONS ====


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


}); //end .ready()