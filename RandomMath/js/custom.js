
var genProblems = function(operator, min, max, amount) {
  var problems = [];  // Array to hold problem objects
  var o1, o2; 		  // Operand 1 & 2

  if(amount > 0 <= 50) {
    switch(operator) {
      case '+':
      case '-':
      case '*':
      case '/':
        for(var i = 1; i <= amount; i++) {
          problems.push({
            o1: Math.floor((Math.random() * max) + min),
            o2: Math.floor((Math.random() * max) + min),
            operator: operator
          });
        }
        break;
      default:
        return "Invalid operand.";
    }
  }
  return problems;
}

var genRandomOperands = function(min, max, amt) {
  var operators = ['+', '-', '*', '/'];
  var result = [];

  for(var i = 0; i < amt; i++)
    result.push(genProblems(operators[Math.floor(Math.random() * operators.length)], min, max, 1)[0]);

  for(var i = 0; i < result.length; i++)
  {
    if( eval(result[i].o1 + result[i].operator + result[i].o2)%2 != 0 && result[i].operator == '/' ) {
      //ans[i] = result[i].o1;
      result[i].o1 = result[i].o1 * result[i].o2;
    } 
  }

  return result;
}

var printProblems = function(problems) {
  for(var index = 0; index < problems.length; index++)
    document.getElementById('problems').innerHTML += ("<td id=data_"+index+">"+" "+(index+1)+"). "+problems[index].o1 + " " + problems[index].operator + " " + problems[index].o2 + " <input type='number' class='input_"+index+"' \/></td>");
}

var checkAnswers = function (problems) {
  var correct 	= 0;
  var incorrect = 0;
  var ans = [];

  for(var i = 0; i < problems.length; i++) {
    if( eval(problems[i].o1 + problems[i].operator + problems[i].o2)%2 != 0 && problems[i].operator == '/' ) {
      ans[i] = problems[i].o1;
      problems[i].o1 = problems[i].o1 * problems[i].o2;
    }
    else
      ans[i] = eval(problems[i].o1 + problems[i].operator + problems[i].o2)
      }

  // Check if the user input matches answer
  for(var i = 0; i < ans.length; i++) {
    var glyph = document.createElement("span");
    document.getElementById('data_'+i).style.color = "white";

    if(ans[i] == document.getElementsByClassName('input_'+i)[0].value) {
      glyph.className = "glyphicon glyphicon-ok pull-right";
      document.getElementById('data_'+i).style.backgroundColor = "#4CAF50";
      document.getElementsByClassName('input_'+i)[0].parentNode.replaceChild(glyph ,document.getElementsByClassName('input_'+i)[0]);
      correct++;
    }
    else
    {
      document.getElementById('data_'+i).innerHTML += " = "+ans[i];
      glyph.className = "glyphicon glyphicon-remove pull-right";
      document.getElementById('data_'+i).style.backgroundColor = "#cc0c0c"; 
      document.getElementById('data_'+i).style.fontWeight = "bold";
      document.getElementsByClassName('input_'+i)[0].parentNode.replaceChild(glyph ,document.getElementsByClassName('input_'+i)[0]);
      incorrect++;
    }
  }

  var score = ((correct)/(correct+incorrect))*100;
  document.getElementById('score').innerHTML = "You got "+correct+" out of "+(correct+incorrect)+", scoring a %"+score+".";

}

document.getElementById('submit').onclick = function() {
  checkAnswers(test);
  this.value = 'Play again?';
  this.style.backgroundColor = "Orange";
  this.id = "again";
  document.getElementById('again').onclick = function() {
    location.reload();
  }
}

var test = genRandomOperands(1, 15, 20);
printProblems(test);
