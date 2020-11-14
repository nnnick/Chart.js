// Should generate non labeled grid lines

module.exports = {
	config: {
		type: 'scatter',
		data: {
			datasets: [{
				data: []
			}],
		},
		options: {
			legend: false,
			title: false,
			scales: {
				x: {
					ticks: {
						display: false
					},
					gridLines: {
						linesBetweenTicks: 2,
						linesBetweenTicksWidth: 0.7,
					}
				},
				y: {
					ticks: {
						display: false
					}
				}
			},
		}
	},
	options: {
		canvas: {
			height: 256,
			width: 512
		},
	}
};
