
const StatsFeatures = () => {
  return (
    <section className="py-16 bg-white">
      <div className="sportyfi-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-sportyfi-orange mb-2">5,000+</div>
            <div className="text-xl font-semibold">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sportyfi-orange mb-2">1,200+</div>
            <div className="text-xl font-semibold">Matches Every Month</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sportyfi-orange mb-2">50+</div>
            <div className="text-xl font-semibold">Official Tournaments</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsFeatures;
