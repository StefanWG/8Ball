// Test `rotate` function
let vec = [1, 0];
let vecRot = rotate(Math.PI/2, vec);
let exp = [0, 1];
assert(vecRot[0] == exp[0] && vecRot[1] == exp[1], `Expected [${exp[0]}, ${exp[1]}], got [${vecRot[0]}, ${vecRot[1]}]`);

vec = [1, 0];
vecRot = rotate(-Math.PI/2, vec);
exp = [0, -1];
assert(vecRot[0] == exp[0] && vecRot[1] == exp[1], `Expected [${exp[0]}, ${exp[1]}], got [${vecRot[0]}, ${vecRot[1]}]`);

vec = [1, 3];
vecRot = rotate(Math.PI/4, vec);
exp = [-1.41421, 2.82843];
assert(vecRot[0] == exp[0] && vecRot[1] == exp[1], `Expected [${exp[0]}, ${exp[1]}], got [${vecRot[0]}, ${vecRot[1]}]`);

vec = [-5, -1];
vecRot = rotate(Math.PI/4*3, vec);
exp = [4.24264, -2.82843];
assert(vecRot[0] == exp[0] && vecRot[1] == exp[1], `Expected [${exp[0]}, ${exp[1]}], got [${vecRot[0]}, ${vecRot[1]}]`);

// Test 

console.log("All tests passed.");

