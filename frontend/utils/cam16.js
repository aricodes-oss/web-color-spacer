// TODO: Move this to the math module
// copypasted from jrus on observablehq.com
// https://observablehq.com/@jrus/srgb
// https://observablehq.com/@jrus/cam16

let gamma_inverse = x =>
  (x > 0.04045) * Math.pow((x + 0.055) * 0.9478672985781991, 2.4) +
  (x <= 0.04045) * 0.07739938080495357 * x;

export function srgb_to_xyz([R, G, B]) {
  (R = gamma_inverse(R)), (G = gamma_inverse(G)), (B = gamma_inverse(B));
  return [
    41.23865632529916 * R + 35.75914909206253 * G + 18.045049120356364 * B,
    21.26368216773238 * R + 71.51829818412506 * G + 7.218019648142546 * B,
    1.9330620152483982 * R + 11.919716364020843 * G + 95.03725870054352 * B,
  ];
}

let gamma = x =>
  (x > 0.0031308) * (1.055 * Math.pow(x, 0.4166666666666667) - 0.055) +
  (x <= 0.0031308) * 12.92 * x;

export function xyz_to_srgb([X, Y, Z]) {
  return [
    gamma(+0.03241003232976359 * X - 0.015373989694887858 * Y - 0.004986158819963629 * Z),
    gamma(-0.009692242522025166 * X + 0.01875929983695176 * Y + 0.00041554226340084706 * Z),
    gamma(+0.0005563941985197545 * X - 0.0020401120612391 * Y + 0.010571489771875336 * Z),
  ];
}

// begin cam16

let parameters = {
  whitepoint: 'D65',
  adapting_luminance: 40, // L_A
  background_luminance: 20, // Y_b; relative to Y_w = 100
  surround: 'average', // 'dark', 'dim', 'average', or a number from 0 to 2
  discounting: false,
};

// Fill in any missing values from the parameters cell
let params = Object.assign(
  {
    whitepoint: 'D65',
    adapting_luminance: 40,
    background_luminance: 20,
    surround: 'average',
    discounting: false,
  },
  parameters,
);

const standard_whitepoints = {
  A: [109.85, 100, 35.585],
  B: [99.09, 100, 85.324],
  C: [98.074, 100, 118.232],
  E: [100, 100, 100], // equal-energy illuminant
  D50: [96.422, 100, 82.521],
  D55: [95.682, 100, 92.149],
  D65: [95.047, 100, 108.883],
  D75: [94.972, 100, 122.638],
  F2: [99.186, 100, 67.393],
  F7: [95.041, 100, 108.747],
  F11: [100.962, 100, 64.35],
};

let isnumber = obj => Object.prototype.toString.call(obj) === '[object Number]';

let exists = obj => typeof obj !== 'undefined' && obj !== null;

let sqrt = Math.sqrt;

let pow = Math.pow;

let sgn = x => (x > 0) - (x < 0);

let mod = (a, b) => a - b * Math.floor(a / b);

let lerp = (a, b, t) => (1 - t) * a + t * b; // Linear interpolation

let clip = (a, b, t) => Math.min(Math.max(t, a), b);

const DEGREES = 180 / Math.PI;

const RADIANS = Math.PI / 180;

let degrees = angle => mod(angle * DEGREES, 360);

let radians = angle => mod(angle, 360) * RADIANS;

let elem_mul = function elem_mul(v0, v1) {
  const n = v0.length,
    prod = new Array(n);
  for (let i = 0; i < n; i++) {
    prod[i] = v0[i] * v1[i];
  }
  return prod;
};

// Given a list of knots and a target point, finds the subinterval
// in which the target point falls. Points outside the interval are
// considered to be in the first or last interval.
function binary_search(knots, target) {
  let n = knots.length - 1,
    low = 0,
    half;
  while ((half = (n / 2) | 0) > 0) {
    low += half * (knots[low + half] <= target);
    n -= half;
  }
  return low;
}

let M16 = ([X, Y, Z]) => [
  +0.401288 * X + 0.650173 * Y - 0.051461 * Z,
  -0.250268 * X + 1.204414 * Y + 0.045854 * Z,
  -0.002079 * X + 0.048952 * Y + 0.953127 * Z,
];

let M16_inv = ([R, G, B]) => [
  +1.862067855087233 * R - 1.011254630531685 * G + 1.491867754444518e-1 * B,
  +3.875265432361372e-1 * R + 6.214474419314753e-1 * G - 8.973985167612518e-3 * B,
  -1.584149884933386e-2 * R - 3.412293802851557e-2 * G + 1.04996443687785 * B,
];

let XYZ_w = standard_whitepoints[params.whitepoint] || params.whitepoint;

let L_A = params.adapting_luminance;

let Y_b = params.background_luminance;

let Y_w = XYZ_w[1]; // White point luminance

let surround = isnumber(params.surround)
  ? params.surround
  : ['dark', 'dim', 'average'].indexOf(params.surround);

let c = surround >= 1 ? lerp(0.59, 0.69, surround - 1) : lerp(0.525, 0.59, surround);

let F = c >= 0.59 ? lerp(0.9, 1.0, (c - 0.59) / 0.1) : lerp(0.8, 0.9, (c - 0.525) / 0.065);

let N_c = F;

let k = 1 / (5 * L_A + 1);

let F_L_Func = () => {
  // Luminance adaptation factor
  let k4 = k * k * k * k;
  return k4 * L_A + 0.1 * (1 - k4) * (1 - k4) * pow(5 * L_A, 1 / 3);
};

let F_L = F_L_Func();

let F_L_4 = pow(F_L, 0.25);

let n = Y_b / Y_w;

let z = 1.48 + sqrt(n); // Lightness non-linearity exponent (modified by `c`)

let N_bb = 0.725 * pow(n, -0.2); // Chromatic induction factors

let N_cb = N_bb;

let D = !params.discounting ? clip(0, 1, F * (1 - (1 / 3.6) * Math.exp((-L_A - 42) / 92))) : 1;

let RGB_w = M16(XYZ_w); // Cone responses of the white point

let D_RGB = RGB_w.map(C_w => lerp(1, Y_w / C_w, D));

let D_RGB_inv = D_RGB.map(D_C => 1 / D_C);

let RGB_cw = [RGB_w[0] * D_RGB[0], RGB_w[1] * D_RGB[1], RGB_w[2] * D_RGB[2]];

let adapt = component => {
  const x = pow(F_L * Math.abs(component) * 0.01, 0.42);
  return (sgn(component) * 400 * x) / (x + 27.13);
};
// In the spec there is an additional 0.1 offset at this step;
// This notebook follows Schlömer's adjustments which move the
// offset to another step but do not affect the final results

let unadapt = component => {
  const exponent = 1 / 0.42;
  const constant = (100 / F_L) * pow(27.13, exponent);
  const cabs = Math.abs(component);
  return sgn(component) * constant * pow(cabs / (400 - cabs), exponent);
};

let RGB_aw = RGB_cw.map(adapt);

let A_w = N_bb * (2 * RGB_aw[0] + RGB_aw[1] + 0.05 * RGB_aw[2]);

function cam16(XYZ) {
  const [R_a, G_a, B_a] = elem_mul(M16(XYZ), D_RGB).map(adapt),
    a = R_a + (-12 * G_a + B_a) / 11, // redness-greenness
    b = (R_a + G_a - 2 * B_a) / 9, // yellowness-blueness
    h_rad = Math.atan2(b, a), // hue in radians
    h = degrees(h_rad), // hue in degrees
    e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8),
    A = N_bb * (2 * R_a + G_a + 0.05 * B_a),
    J_root = pow(A / A_w, 0.5 * c * z),
    J = 100 * J_root * J_root, // lightness
    Q = (4 / c) * J_root * (A_w + 4) * F_L_4, // brightness
    t = ((5e4 / 13) * N_c * N_cb * e_t * sqrt(a * a + b * b)) / (R_a + G_a + 1.05 * B_a + 0.305),
    alpha = pow(t, 0.9) * pow(1.64 - pow(0.29, n), 0.73),
    C = alpha * J_root, // chroma
    M = C * F_L_4, // colorfulness
    s = 50 * sqrt((c * alpha) / (A_w + 4)); // saturation
  return { J, C, h, Q, M, s };
}

function cam16_inverse({ Q, M, J, C, s, h }) {
  if (!(exists(h) && exists(J) + exists(Q) == 1 && exists(M) + exists(C) + exists(s) == 1)) {
    throw new Error(
      'Need exactly need exactly one of each of ' + '{J, Q}, {M, C, s}, {h} as model inputs',
    );
  }
  if (J == 0 || Q == 0) return [0, 0, 0];
  const h_rad = radians(h),
    cos_h = Math.cos(h_rad),
    sin_h = Math.sin(h_rad),
    J_root = sqrt(J) * 0.1 || (0.25 * c * Q) / ((A_w + 4) * F_L_4),
    alpha = s == null ? (C || M / F_L_4 || 0) / J_root : (0.0004 * s * s * (A_w + 4)) / c,
    t = pow(alpha * pow(1.64 - pow(0.29, n), -0.73), 10 / 9),
    e_t = 0.25 * (Math.cos(h_rad + 2) + 3.8),
    A = A_w * pow(J_root, 2 / c / z),
    p_1 = (5e4 / 13) * N_c * N_cb * e_t,
    p_2 = A / N_bb,
    r = (23 * (p_2 + 0.305) * t) / (23 * p_1 + t * (11 * cos_h + 108 * sin_h)),
    a = r * cos_h,
    b = r * sin_h,
    denom = 1 / 1403,
    RGB_c = [
      (460 * p_2 + 451 * a + 288 * b) * denom,
      (460 * p_2 - 891 * a - 261 * b) * denom,
      (460 * p_2 - 220 * a - 6300 * b) * denom,
    ].map(unadapt),
    XYZ = M16_inv(elem_mul(RGB_c, D_RGB_inv));
  return XYZ;
}

export function cam16_ucs(XYZ) {
  let { J, M, h } = cam16(XYZ),
    h_rad = radians(h);
  M = Math.log(1 + 0.0228 * M) / 0.0228;
  return {
    J: (1.7 * J) / (1 + 0.007 * J),
    a: M * Math.cos(h_rad),
    b: M * Math.sin(h_rad),
    M,
    h,
  };
}

export function cam16_ucs_inverse({ J, M, h, a, b }) {
  const ab = exists(a) && exists(b),
    Mh = exists(M) && exists(h);
  if (ab ^ (Mh == 0)) {
    throw new Error('Either {a, b} or {M, h} (but not both pairs) are required inputs.');
  }
  if (ab) {
    M = sqrt(a * a + b * b);
    h = degrees(Math.atan2(b, a));
  }
  M = (Math.exp(M * 0.0228) - 1) / 0.0228;
  J = J / (1.7 - 0.007 * J);
  return cam16_inverse({ J, M, h });
}

function deltaE(XYZ0, XYZ1) {
  const { J: J0, a: a0, b: b0 } = cam16_ucs(XYZ0),
    { J: J1, a: a1, b: b1 } = cam16_ucs(XYZ1),
    dJ = J1 - J0,
    da = a1 - a0,
    db = b1 - b0;
  return 1.41 * pow(dJ * dJ + da * da + db * db, 0.315);
}

function cat16(source_whitepoint, target_whitepoint) {
  source_whitepoint = standard_whitepoints[source_whitepoint] || source_whitepoint;
  target_whitepoint = standard_whitepoints[target_whitepoint] || target_whitepoint;
  const RGB_w_source = M16(source_whitepoint),
    RGB_w_target = M16(target_whitepoint),
    D_RGB_source_to_target = [0, 1, 2].map(
      i => lerp(1, 100 / RGB_w_source[i], D) / lerp(1, 100 / RGB_w_target[i], D),
    ),
    [M00, M10, M20] = M16(elem_mul(M16_inv([1, 0, 0]), D_RGB_source_to_target)),
    [M01, M11, M21] = M16(elem_mul(M16_inv([0, 1, 0]), D_RGB_source_to_target)),
    [M02, M12, M22] = M16(elem_mul(M16_inv([0, 0, 1]), D_RGB_source_to_target));
  return ([X, Y, Z]) => [
    M00 * X + M01 * Y + M02 * Z,
    M10 * X + M11 * Y + M12 * Z,
    M20 * X + M21 * Y + M22 * Z,
  ];
}
