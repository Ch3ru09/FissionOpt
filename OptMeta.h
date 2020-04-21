#ifndef _OPT_META_H_
#define _OPT_META_H_
#include <array>
#include <random>
#include "Fission.h"

struct OptMetaIndividual {
  xt::xtensor<int, 3> state;
  double value;
};

class OptMeta {
  const Settings &settings;
  std::array<OptMetaIndividual, 5> population;
  OptMetaIndividual bestSoFar;
  std::vector<int> allTiles;
  std::mt19937 rng;
public:
  OptMeta(const Settings &settings);
  void restart();
  bool step();
  const xt::xtensor<int, 3> &getBestState() const { return bestSoFar.state; };
  double getBestValue() const { return bestSoFar.value; };
};

#endif
