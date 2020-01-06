module.exports = {
  name: 'echo',
  description: 'shout into the void',
  examples: ['ds echo "Hello World"'],
  options: [
    {
      name: 'value',
      type: String,
      defaultOption: true,
      description: 'what to shout'
    }
  ]
};
