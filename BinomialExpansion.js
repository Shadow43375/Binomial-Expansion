class Monomial {
  constructor(constant, base, exponent) {
    this._constant = constant.toString();
    this._subTerms = []
    this._subTerms.push({
      base: base,
      exponent: exponent.toString()
    });
  }

  get constant() {
    return this._constant;
  }

  set constant(newConstant) {
    this._constant = newConstant;
  }

  appendSubTerm(newTerm) {
    this._constant = BigInt(this._constant) * BigInt(newTerm.constant);
    console.log(typeof this._constant);
    for(let i = 0; i < newTerm._subTerms.length; i++) {
      this._subTerms.push(newTerm._subTerms[i]);
    }
  }

}


class Polynomial {
  constructor() {
    this._terms = [];
    for(let i = 0; i < arguments.length; i++) {
      this._terms.push(arguments[i]);
    }
  }

  getTerm(termIndex) {
    return this._terms[termIndex];
  }

  numberOfTerms() {
    return this._terms.length;
  }

  appendTerm(newTerm) {
    this._terms.push(newTerm);
  }
}


function biCoefficient(n, k) {
  if(n === 0n && k !==0n) {
    return 0n;
  }
  else if(n === 0n && k === 0n) {
    return 1n;
  }
  else if(n !==0n && k === 0n) {
    return 1n;
  }
  else if(n !== 0n && k !==0n){
    let numerator = 1n;
    let denominator = 1n;
    for(let i = n; i > 0n; i--) {
      numerator *= i;
    }
    for(let j = k; j > 0n; j--) {
      denominator *= j;
    }
    for(let m = n - k; m > 0n; m--) {
      denominator *= m;
    }
  
    return numerator/denominator;
  }
}

class BinomialExpansion {
  static getNth(n) {
    if(n<2n) {
      return false;
    }
    else if(n >= 2n) {
      let polynomial = new Polynomial();
      for(let k = 0n; k <= n; k += 1n) {
        let newMonomial = new Monomial(biCoefficient(n, k), 'x', n-k);
        newMonomial.appendSubTerm(new Monomial(1n, 'y', k));
        polynomial.appendTerm(newMonomial);
      }
      return polynomial;
    }
  }
}


class MathRender {
   static _getMonomialString(nomial) {
    //  console.log(nomial);
    let str = "";
    for(let i = 0; i < nomial._subTerms.length; i++) {
        // console.log(nomial._subTerms[i])
        if(nomial.constant == 0) {
          // console.log("print nothing-- its ZERO")
          str = "";
        }
        else if(nomial._subTerms[i].exponent == 1) {
          // console.log("print the base with NO exponent visible")
          str = str + "{" + nomial._subTerms[i].base + "}";
        }
        else if(nomial.constant == 1 && nomial._subTerms[i].exponent > 1) {
          // console.log("the base with exponent WIHTOUT constant in front")
          str = str + "{" + nomial._subTerms[i].base + "}^{" + nomial._subTerms[i].exponent + "}"
        }
        else if(nomial._subTerms[i].exponent == 0){
          // console.log("print NO changes. Value is equivilent to ONE")
          str = str;
        }
        else if(nomial.constant > 1 && nomial._subTerms[i].exponent > 1) {
          // console.log("print constant AND base with exponent");
          str = str + "{" + nomial._subTerms[i].base + "}^{" + nomial._subTerms[i].exponent + "}";
        }
      }
    
    if(nomial.constant > 1) {
      str = nomial.constant.toString() + str;
    }
    return str;
  }


  static getPolynomialString(nomial) {
    let str = "$$" + this._getMonomialString(nomial.getTerm(0));
    for(let i = 1; i < nomial.numberOfTerms(); i++) {
      if(nomial.getTerm(i).constant > 0) {
        str = str + " + " + this._getMonomialString(nomial.getTerm(i));
      }
    }
    str = str + "$$"
    return str;
  }


  static render(textNode) {
    let mathDiv = document.getElementById('mathDiv');
    mathDiv.appendChild(textNode);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
}

document.getElementById('clearButton').addEventListener('click', function(){
  let mathDiv = document.getElementById('mathDiv');
  while (mathDiv.firstChild) {
    mathDiv.removeChild(mathDiv.firstChild);
  }
  document.getElementById('numberInput').value = "";
});

document.getElementById('goButton').addEventListener('click', function(){
  let nValue = BigInt(document.getElementById('numberInput').value);
  
  let polynomial = BinomialExpansion.getNth(nValue);
  let mathStr = MathRender.getPolynomialString(polynomial);
  let textNode = document.createTextNode(mathStr);
  MathRender.render(textNode);
})
