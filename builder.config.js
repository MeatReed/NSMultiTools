const ICONS_DIR = 'icons/'

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'win-icon.png',
    publisherName: 'MeatReed',
    target: [
      {
        "target": "nsis"
      },
      {
        "target": "7z"
      },
      {
        "target": "zip"
      }
    ]
  },

  nsis: {
    differentialPackage: true
  }
}

const linuxOS = {
  linux: {
    icon: ICONS_DIR,
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'con.icns'
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

module.exports = {
  asar: true,
  productName: 'NSMultiTools',
  appId: 'org.meatreed.nsmultitools',
  artifactName: 'nsmultitools-${version}.${ext}',
  directories: {
    output: 'build'
  },
  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    },
    {
      from: 'src/resources/',
      to: 'dist/resources/'
    }
  ],
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
