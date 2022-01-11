// Handle error in a human readable way
export function handleError(error, showStack) {
  const { message, stack } = Error(error);
  console.warn({
    message: message,
    // pass true to enable the stack, else nothing
    trace: showStack ? stack : 'disabled',
  });
}
