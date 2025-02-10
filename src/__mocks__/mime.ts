module.exports = {
    getType: jest.fn((path): string => {
      const paths = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        'json': 'application/json',
        'html': 'text/html',
      } as Record<string, string>;

      for (const extension in paths) {
        if (path.endsWith(extension)) {
          return paths[extension];
        }
      }

      return 'application/octet-stream';
    }),
  };