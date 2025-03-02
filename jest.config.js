module.exports = {
  preset: 'ts-jest',
  moduleDirectories: [
    'src',
    'node_modules',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/stubs/FileStub.js',
    '\\.(css|less)$': '<rootDir>/jest/stubs/CSSStub.js'
  },
  setupFiles: [
    './jest/setup.js'
  ],
  cacheDirectory: './jest/cache/'
};