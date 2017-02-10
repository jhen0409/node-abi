var semver = require('semver')

function getAbi (target, runtime) {
  if (target === String(Number(target))) return target
  if (target) target = target.replace(/^v/, '')
  if (!runtime) runtime = 'node'

  if (runtime === 'node') {
    if (!target) return process.versions.modules
    if (target === process.versions.node) return process.versions.modules
  }
  
  var abi

  for (var i = 0; i < allTargets.length; i++) {
    var t = allTargets[i]
    if (t.runtime !== runtime) continue
    if (semver.lte(t.target, target)) abi = t.abi
    else break
  }

  if (abi) return abi
  throw new Error('Could not detect abi for version ' + target + ' and runtime ' + runtime + '.  Updating "node-abi" might help solve this issue if it is a new release of ' + runtime)
}

function getTarget (abi, runtime) {
  if (abi && abi !== String(Number(abi))) return abi
  if (!runtime) runtime = 'node'

  if (runtime === 'node' && !abi) return process.versions.node

  var match = allTargets
    .filter(function (t) {
      return t.abi === abi && t.runtime === runtime
    })
    .map(function (t) {
      return t.target
    })
  if (match.length) return match[0]

  throw new Error('Could not detect target for abi ' + abi + ' and runtime ' + runtime)
}

var supportedTargets = [
  {runtime: 'node', target: '0.10.48', abi: '11', lts: false},
  {runtime: 'node', target: '0.12.17', abi: '14', lts: false},
  {runtime: 'node', target: '4.6.1', abi: '46', lts: new Date() < new Date(2017, 04, 01)},
  {runtime: 'node', target: '5.12.0', abi: '47', lts: false},
  {runtime: 'node', target: '6.9.4', abi: '48', lts: new Date() < new Date(2018, 04, 18)},
  {runtime: 'node', target: '7.4.0', abi: '51', lts: false},
  {runtime: 'electron', target: '1.0.2', abi: '47', lts: false},
  {runtime: 'electron', target: '1.2.8', abi: '48', lts: false},
  {runtime: 'electron', target: '1.3.13', abi: '49', lts: false},
  {runtime: 'electron', target: '1.4.15', abi: '50', lts: false},
  {runtime: 'electron', target: '1.5.0', abi: '51', lts: false},
  {runtime: 'electron', target: '1.6.0', abi: '53', lts: false}
]

var deprecatedTargets = [
  {runtime: 'node', target: '0.2.0', abi: '1', lts: false},
  {runtime: 'node', target: '0.9.1', abi: '0x000A', lts: false},
  {runtime: 'node', target: '0.10.0', abi: '0x000B', lts: false},
  {runtime: 'node', target: '0.11.0', abi: '0x000C', lts: false},
  {runtime: 'node', target: '0.11.10', abi: '13', lts: false},
  {runtime: 'node', target: '1.0.0', abi: '42', lts: false},
  {runtime: 'node', target: '1.1.0', abi: '43', lts: false},
  {runtime: 'node', target: '2.0.0', abi: '44', lts: false},
  {runtime: 'node', target: '3.0.0', abi: '45', lts: false},
  {runtime: 'node', target: '8.0.0', abi: '52', lts: false},
  {runtime: 'electron', target: '0.30.0', abi: '44', lts: false},
  {runtime: 'electron', target: '0.31.0', abi: '45', lts: false},
  {runtime: 'electron', target: '0.33.0', abi: '46', lts: false}
]

var allTargets = supportedTargets.concat(deprecatedTargets)

exports.getAbi = getAbi
exports.getTarget = getTarget
exports.supportedTargets = supportedTargets
exports.deprecatedTargets = deprecatedTargets
exports.allTargets = allTargets
