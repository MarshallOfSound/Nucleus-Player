$('.color-square').click((e) => {
  const newColor = $(e.currentTarget).css('background-color');
  Emitter.fire('theme:updateColor', newColor);
});

$('#theme-state').change((e) => {
  Emitter.fire('theme:updateState', { state: $(e.currentTarget).is(':checked') });
});
