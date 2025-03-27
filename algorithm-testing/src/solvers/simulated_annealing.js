/**
 * Implements the simulated annealing optimization algorithm.
 */
export default class SimulatedAnnealing {
    /**
     * Creates an instance of SimulatedAnnealing.
     * 
     * @param {Object} init_state - The initial state.
     * @param {number} iterations - The number of iterations to perform.
     * @param {function(number): number} temperature - A function that calculates the temperature given the fraction of the time budget that has been expended so far.
     * @param {function(Object): Object} neighbor - A function that generates a random neighboring solution.
     * @param {function(Object): number} score - A function that calculates the score of a solution.
     */
    constructor(init_state, iterations, temperature, neighbor, score) {
        this.init_state = init_state;
        this.iterations = iterations;
        this.temperature = temperature;
        this.neighbor = neighbor;
        this.score = score;
        this.best_solution = init_state;
        this.best_score = score(init_state);
    }

    /**
     * Performs the simulated annealing optimization algorithm.
     * 
     * @returns {Object} The best solution found.
     */
    optimize() {
        let cur_solution = this.init_state;
        let cur_score = this.score(this.init_state);

        for (let i = 0; i < this.iterations; i++) {
            const temp = this.temperature(1 - (i + 1) / this.iterations);
            const new_solution = this.neighbor(cur_solution);
            const new_score = this.score(new_solution);

            if (this.acceptance_probability(cur_score, new_score, temp) >= Math.random()) {
                cur_solution = new_solution;
                cur_score = new_score;
            }

            if (cur_score > this.best_score) {
                this.best_solution = cur_solution;
                this.best_score = cur_score;
            }
        }

        return this.best_solution;
    }

    /**
     * Calculates the acceptance probability for a new solution.
     * 
     * @param {number} score_a - The score of the current solution.
     * @param {number} score_b - The score of the new solution.
     * @param {number} temp - The current temperature.
     * @returns {number} The acceptance probability.
     */
    acceptance_probability(score_a, score_b, temp) {
        if (score_b > score_a) {
            return 1.0;
        }
        return Math.exp((score_b - score_a) / temp);
    }
}
