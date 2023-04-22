class ColorfulConsole {
	static colors = {
		red: '\x1b[31m',
		orange: '\x1b[38;5;208m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		green: '\x1b[32m',
		magenta: '\x1b[35m',
		pink: '\x1b[38;5;206m',
		black: '\x1b[30m',
		white: '\x1b[37m'
	}
	
	static styles = {
		bold: '\x1b[1m',
		reset: '\x1b[0m'
	}
	
	static colorize(text, color) {
		const code = this.colors[color]
		
		if (!code) {
			throw new Error(`Invalid color: ${color}`)
		}
		
		return `${code}${text}${this.styles.reset}`
	}
	
	static bold(text) {
		return `${this.styles.bold}${text}${this.styles.reset}`
	}
	
	static red(text) {
		return this.colorize(text, 'red')
	}
	
	static orange(text) {
		return this.colorize(text, 'orange')
	}
	
	static yellow(text) {
		return this.colorize(text, 'yellow')
	}
	
	static blue(text) {
		return this.colorize(text, 'blue')
	}
	
	static green(text) {
		return this.colorize(text, 'green')
	}
	
	static magenta(text) {
		return this.colorize(text, 'magenta')
	}
	
	static pink(text) {
		return this.colorize(text, 'pink')
	}
	
	static black(text) {
		return this.colorize(text, 'black')
	}
	
	static white(text) {
		return this.colorize(text, 'white')
	}
}

module.exports = ColorfulConsole