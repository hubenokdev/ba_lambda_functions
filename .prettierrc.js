module.exports = {
  printWidth: 100,
  overrides: [
    {
      files: "*.md",
      options: {
        // Needed for bullet lists to render in a way that works in Bitbucket
        tabWidth: 4,
      },
    },
  ],
};
