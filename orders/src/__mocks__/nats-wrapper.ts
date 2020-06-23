export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      // Mock fn that receives a callback fn, invokes it to mimic event being published successfully
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      )
  }
};
