export default {
  koch_snowflake: {
      variables: 'F',
      axiom: 'F--F--F',
      rules: ['F:F+F--F+F'],
      default: {
          n: 1,
          angle: 60
      }
  },
  koch_curve: {
      variables: 'F',
      axiom: 'F',
      rules: ['F:F+F-F-F+F'],
      default: {
          n: 2,
          angle: 90
      }
  },
  hexa_flake: {
      variables: 'F',
      axiom: 'F+F+F+F+F+F',
      rules: ['F:F+F+F--F--F+F+F'],
      default: {
          n: 2,
          angle: 60
      }
  },
  plant: {
      variables: 'XF',
      axiom: '+++X',
      rules: ['X:F[-X][X]F[-X]+FX', 'F : FF'],
      default: {
          n: 4,
          angle: 25
      }
  },  
};